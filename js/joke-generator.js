document.addEventListener('DOMContentLoaded', () => {

  // ===== 笑话生成器逻辑 =====
  const getJokeBtn = document.getElementById('get-joke-btn');
  const copyJokeBtn = document.getElementById('copy-joke-btn');
  const shareJokeBtn = document.getElementById('share-joke-btn');
  const jokeText = document.getElementById('joke-text');
  const jokeType = document.getElementById('joke-type');
  const jokeCount = document.getElementById('joke-count');
  const loadingStatus = document.getElementById('loading-status');

  let currentJoke = '';
  let jokesLoaded = 0;
  const API_URL = 'https://official-joke-api.appspot.com/random_joke';

  // 获取笑话函数
  async function fetchJoke() {
    getJokeBtn.disabled = true;
    getJokeBtn.classList.add('loading');
    loadingStatus.textContent = '加载中...';

    try {
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // 构建完整笑话
      currentJoke = `${data.setup}\n\n${data.punchline}`;
      
      // 更新UI
      jokeText.textContent = currentJoke;
      jokeType.textContent = `🏷️ ${data.type.toUpperCase()}`;
      
      // 更新统计
      jokesLoaded++;
      jokeCount.textContent = jokesLoaded;
      loadingStatus.textContent = '✓ 加载成功';

      // 3秒后清除加载状态
      setTimeout(() => {
        loadingStatus.textContent = '';
      }, 3000);

    } catch (error) {
      console.error('获取笑话失败:', error);
      jokeText.textContent = '哎呀！获取笑话失败，请检查网络连接后重试。';
      jokeType.textContent = '❌ 错误';
      loadingStatus.textContent = `错误: ${error.message}`;
      loadingStatus.style.color = '#ff6b6b';
    } finally {
      getJokeBtn.disabled = false;
      getJokeBtn.classList.remove('loading');
    }
  }

  // 复制笑话到剪贴板
  async function copyToClipboard() {
    if (!currentJoke) {
      showMessage('请先获取笑话！');
      return;
    }

    try {
      await navigator.clipboard.writeText(currentJoke);
      showMessage('✓ 已复制到剪贴板');
    } catch (error) {
      console.error('复制失败:', error);
      // 降级方案：使用老方法
      const textarea = document.createElement('textarea');
      textarea.value = currentJoke;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showMessage('✓ 已复制到剪贴板');
    }
  }

  // 分享笑话
  function shareJoke() {
    if (!currentJoke) {
      showMessage('请先获取笑话！');
      return;
    }

    const shareText = `看看这个笑话：\n\n${currentJoke}\n\n来自 灵镜塔罗笑话生成器 ✨`;

    // 检查是否支持Web Share API
    if (navigator.share) {
      navigator.share({
        title: '灵镜塔罗笑话生成器',
        text: shareText,
      }).catch(error => console.log('分享被取消或失败:', error));
    } else {
      // 降级方案：复制到剪贴板并提示
      navigator.clipboard.writeText(shareText)
        .then(() => showMessage('✓ 已复制分享内容到剪贴板'))
        .catch(() => {
          alert('请手动复制笑话进行分享：\n\n' + shareText);
        });
    }
  }

  // 显示提示信息
  function showMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    setTimeout(() => {
      messageDiv.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        messageDiv.remove();
      }, 300);
    }, 2000);
  }

  // 添加slideOut动画
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideOut {
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // 事件监听
  getJokeBtn.addEventListener('click', fetchJoke);
  copyJokeBtn.addEventListener('click', copyToClipboard);
  shareJokeBtn.addEventListener('click', shareJoke);

  // 页面加载时自动获取第一个笑话
  fetchJoke();

  // ===== 从 main.js 继承的功能 =====
  
  // 导航汉堡菜单
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // 导航栏滚动效果
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // 动态星星背景
  const starsContainer = document.getElementById('stars');

  function createStars() {
    const starCount = window.innerWidth < 768 ? 50 : 100;
    let starsCSS = '';

    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = (Math.random() * 2 + 1).toFixed(1);
      const opacity = (Math.random() * 0.5 + 0.1).toFixed(2);
      const delay = (Math.random() * 5).toFixed(1);
      starsCSS += `radial-gradient(${size}px ${size}px at ${x}% ${y}%, rgba(255,255,255,${opacity}), transparent),\n`;
    }

    starsContainer.style.background = starsCSS.slice(0, -2);
    starsContainer.style.backgroundSize = '100% 100%';
  }

  createStars();

  window.addEventListener('resize', createStars);
});
