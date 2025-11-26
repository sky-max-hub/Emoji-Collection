// 自动滚动模块
class AutoScroll {
    constructor() {
        this.scrollLoadingAvg = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg class="icon" width="200px" height="200.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M475.428571 97.52381h73.142858v219.428571h-73.142858z m0 609.523809h73.142858v219.428571h-73.142858zM926.47619 475.428571v73.142858h-219.428571v-73.142858z m-609.523809 0v73.142858H97.52381v-73.142858zM779.215238 193.072762l51.712 51.687619-155.136 155.184762-51.736381-51.736381zM348.208762 624.054857l51.736381 51.736381-155.160381 155.136-51.712-51.687619zM193.097143 244.784762l51.687619-51.712 155.184762 155.136-51.736381 51.736381z m430.982095 431.006476l51.736381-51.736381 155.136 155.160381-51.687619 51.712z" /></svg>'
        this.arrowBottomIconAvg = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg class="icon" width="200px" height="200.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 624c-12.288 0-24.576-4.672-33.92-14.08l-256-256c-18.752-18.752-18.752-49.152 0-67.904s49.152-18.752 67.904 0L512 508.096l222.08-222.08c18.752-18.752 49.152-18.752 67.904 0s18.752 49.152 0 67.904l-256 256C536.576 619.328 524.288 624 512 624zM832 768c0-35.392-28.608-64-64-64L256 704c-35.392 0-64 28.608-64 64l0 0c0 35.392 28.608 64 64 64l512 0C803.392 832 832 803.392 832 768L832 768z" /></svg>'
        this.arrowTopIconAvg = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg class="icon" width="200px" height="200.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M768 752c-12.288 0-24.576-4.672-33.92-14.08L512 515.904l-222.08 222.08c-18.752 18.752-49.152 18.752-67.904 0s-18.752-49.152 0-67.904l256-256c18.752-18.752 49.152-18.752 67.904 0l256 256c18.752 18.752 18.752 49.152 0 67.904C792.576 747.328 780.288 752 768 752zM832 256c0 35.328-28.608 64-64 64L256 320C220.608 320 192 291.328 192 256l0 0c0-35.328 28.608-64 64-64l512 0C803.392 192 832 220.672 832 256L832 256z" /></svg>'
        this.autoScrollEnabled = false;
        this.autoScrollSpeed = 1;
        this.autoScrollAnimationFrame = null;
        this.lastLoadedImagesCount = 0;
        this.lastWheelTime = 0;

        this.createScrollButton();
        this.setupWheelListener();
    }

    // 创建置底按钮
    createScrollButton() {
        this.scrollButtonContainer = document.createElement('div');
        this.scrollButtonContainer.className = 'scroll-button-container';

        this.scrollBottomButton = document.createElement('button');
        this.scrollBottomButton.className = 'scroll-to-button';
        this.scrollBottomButton.innerHTML = this.arrowBottomIconAvg;

        this.scrollTopButton = document.createElement('button');
        this.scrollTopButton.className = 'scroll-to-button';
        this.scrollTopButton.innerHTML = this.arrowTopIconAvg;
        this.scrollButtonContainer.appendChild(this.scrollTopButton);
        this.scrollButtonContainer.appendChild(this.scrollBottomButton);
        document.body.appendChild(this.scrollButtonContainer);

        this.scrollBottomButton.addEventListener('click', () => {
            this.toggleAutoScroll();
        });

        this.scrollTopButton.addEventListener('click', () => {
            this.scrollToTop();
        });
    }

    // 设置滚轮监听
    setupWheelListener() {
        window.addEventListener('wheel', (event) => {
            const now = Date.now();

            // 如果自动滚动已启用，并且检测到向上滚动
            if (this.autoScrollEnabled && event.deltaY < 0) {
                // 确保不会因为触控板的微小滚动而过于敏感
                if (now - this.lastWheelTime > 50) {
                    console.log('检测到向上滚动，停止自动滚动');
                    this.toggleAutoScroll();
                }
            }
            this.lastWheelTime = now;
        }, { passive: true });
    }

    // 自动滚动函数
    autoScroll() {
        if (!this.autoScrollEnabled) return;

        // 获取当前已加载的图片数量
        const currentImagesCount = document.querySelectorAll('.gallery img').length;

        // 根据新加载的图片数量调整滚动速度
        if (currentImagesCount > this.lastLoadedImagesCount) {
            // 新图片加载时，临时提高滚动速度
            this.autoScrollSpeed = 4;
            setTimeout(() => {
                // 1秒后恢复正常速度
                if (this.autoScrollEnabled) this.autoScrollSpeed = 4;
            }, 1000);
        }
        this.lastLoadedImagesCount = currentImagesCount;

        // 计算页面总高度和当前滚动位置
        const totalHeight = document.documentElement.scrollHeight;
        const currentScroll = window.scrollY;
        const windowHeight = window.innerHeight;

        // 如果还没到底，继续滚动
        if (currentScroll + windowHeight < totalHeight) {
            window.scrollBy(0, this.autoScrollSpeed);
            this.autoScrollAnimationFrame = requestAnimationFrame(() => this.autoScroll());
        } else {
            // 到达底部时，等待新图片加载
            setTimeout(() => {
                if (this.autoScrollEnabled) {
                    this.autoScrollAnimationFrame = requestAnimationFrame(() => this.autoScroll());
                }
            }, 500);
        }
    }

    // 切换自动滚动状态
    toggleAutoScroll() {
        this.autoScrollEnabled = !this.autoScrollEnabled;
        this.scrollBottomButton.classList.toggle('active');

        if (this.autoScrollEnabled) {
            this.autoScrollSpeed = 1;
            this.autoScrollAnimationFrame = requestAnimationFrame(() => this.autoScroll());
            this.scrollBottomButton.innerHTML = this.scrollLoadingAvg;
        } else {
            if (this.autoScrollAnimationFrame) {
                cancelAnimationFrame(this.autoScrollAnimationFrame);
            }
            this.scrollBottomButton.style.transform = 'none';
            this.scrollBottomButton.innerHTML = this.arrowBottomIconAvg;
        }
    }

    // 设置滚动按钮显示逻辑
    setupScrollButtonVisibility() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // 当页面滚动超过一屏时显示按钮
            if (scrollTop > windowHeight / 2) {
                this.scrollButtonContainer.classList.add('visible');
            } else {
                this.scrollButtonContainer.classList.remove('visible');
                // 如果按钮隐藏，同时关闭自动滚动
                if (this.autoScrollEnabled) {
                    this.toggleAutoScroll();
                }
            }
        });
    }

    // 停止自动滚动
    stopAutoScroll() {
        if (this.autoScrollEnabled) {
            this.toggleAutoScroll();
        }
    }

    // 滚动到顶部
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // 获取自动滚动状态
    isAutoScrollEnabled() {
        return this.autoScrollEnabled;
    }
}

// 导出为全局变量
window.AutoScroll = AutoScroll; 