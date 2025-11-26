// 自动滚动模块
class ImageSelect {
    constructor() {
        this.imageSelected = false;
        this.imageSelectedCount = 0;
        this.imageSelectButton = document.getElementById('image-select');
    }
}

// 导出为全局变量
window.ImageSelect = ImageSelect; 