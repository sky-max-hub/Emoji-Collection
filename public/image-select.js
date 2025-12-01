// 图片选择模块
class ImageSelect {
    constructor() {
        this.imageSelected = false;
        this.imageSelectedCount = 0;
        this.imageSelectAllButton = document.getElementById('image-select-all');
        this.exportSelectedButton = document.getElementById('export-selected');
        // 存储选中的图片
        this.selectedImages = new Set();

        // 添加全选按钮事件监听器
        this.setupSelectAllButton();
        // 添加导出按钮事件监听器
        this.setupExportButton();
    }

    // 设置全选按钮事件
    setupSelectAllButton() {
        if (this.imageSelectAllButton) {
            this.imageSelectAllButton.addEventListener('click', () => {
                this.toggleSelectAll();
            });
        }
    }

    // 设置导出按钮事件
    setupExportButton() {
        if (this.exportSelectedButton) {
            this.exportSelectedButton.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡
                this.exportSelectedImages();
            });
        }
    }

    // 切换全选/取消全选
    toggleSelectAll() {
        // 获取当前页面所有图片
        const allImages = document.querySelectorAll('.gallery img');
        const currentlySelectedCount = this.selectedImages.size;
        const totalImages = allImages.length;

        // 如果当前没有选中任何图片或者选中的图片少于总图片数，则执行全选
        // 但如果已经选中了部分图片，则也是执行全选而不是取消全选
        if (currentlySelectedCount < totalImages) {
            this.selectAll();
        } else {
            // 如果所有图片都已选中，则取消全选
            this.clearSelection();
        }
    }

    // 全选所有图片
    selectAll() {
        // 获取当前页面所有图片
        const allImages = document.querySelectorAll('.gallery img');
        console.log('全选所有图片', allImages);
        allImages.forEach(img => {
            const selectImage = {}
            selectImage.name = img.alt;
            selectImage.url = img.currentSrc;
            // 处理所有图片，确保它们都被选中
            // 找到对应的选中按钮并直接设置选中状态
            const selectButtonContainer = img.parentNode.querySelector('.select-button-container');
            if (selectButtonContainer) {
                const selectButton = selectButtonContainer.querySelector('.select-button');
                if (selectButton) {
                    // 直接添加选中类和更新状态
                    selectButton.classList.add('selected');
                    this.selectedImages.add(selectImage);
                    console.log('图片被选中:', selectImage);
                }
            }
        });

        // 更新选中计数和全选按钮图标
        this.updateSelectedCount();
        this.updateSelectAllButtonIcon();
    }

    // 添加选中按钮
    addSelectButton(img) {
        // 创建选中按钮容器
        const selectButtonContainer = document.createElement('div');
        selectButtonContainer.className = 'select-button-container';

        // 创建选中按钮
        const selectButton = document.createElement('button');
        selectButton.className = 'select-button';
        selectButton.innerHTML = '✓'; // 使用勾选符号

        // 将按钮添加到容器
        selectButtonContainer.appendChild(selectButton);

        // 将容器添加到图片的父元素（图片容器）
        img.parentNode.appendChild(selectButtonContainer);

        // 设置按钮的点击事件
        selectButton.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡，避免触发图片点击事件
            selectButton.classList.toggle('selected');

            // 更新选中状态
            const selectImage = {}
            selectImage.name = img.alt;
            selectImage.url = img.currentSrc;
            
            if (selectButton.classList.contains('selected')) {
                this.selectedImages.add(selectImage);
                console.log('图片被选中:', selectImage);
            } else {
                this.selectedImages.delete(selectImage);
                console.log('图片取消选中:', selectImage);
            }

            // 更新选中计数和全选按钮图标
            this.updateSelectedCount();
            this.updateSelectAllButtonIcon();
        });
    }

    // 更新选中计数
    updateSelectedCount() {
        this.imageSelectedCount = this.selectedImages.size;
        console.log('当前选中图片数量:', this.imageSelectedCount);
    }

    // 获取选中的图片
    getSelectedImages() {
        return Array.from(this.selectedImages);
    }

    // 清除所有选中状态
    clearSelection() {
        console.log('清除所有选中状态');

        // 移除所有选中按钮的选中状态
        document.querySelectorAll('.select-button.selected').forEach(button => {
            button.classList.remove('selected');
        });

        // 清空选中集合
        this.selectedImages.clear();

        // 更新计数
        this.updateSelectedCount();

        // 更新全选按钮图标
        this.updateSelectAllButtonIcon();
    }

    // 更新全选按钮图标
    updateSelectAllButtonIcon() {
        const icon = document.getElementById('image-select-icon');
        if (icon) {
            // 获取当前页面所有图片
            const allImages = document.querySelectorAll('.gallery img');
            const totalImages = allImages.length;
            const selectedCount = this.selectedImages.size;

            if (selectedCount > 0 && selectedCount === totalImages) {
                // 全选状态
                icon.src = 'assets/check_selected.svg';
            } else if (selectedCount > 0) {
                // 部分选中状态
                icon.src = 'assets/check_selected.svg';
            } else {
                // 未选中状态
                icon.src = 'assets/check_unselected.svg';
            }
        }

        // 根据是否有选中的图片显示/隐藏导出按钮
        if (this.exportSelectedButton) {
            if (this.selectedImages.size > 0) {
                this.exportSelectedButton.style.display = 'block';
            } else {
                this.exportSelectedButton.style.display = 'none';
            }
        }
    }

    // 导出选中的图片
    exportSelectedImages() {
        console.log("导出选中的图片:", this.selectedImages);

        if (this.selectedImages.size === 0) {
            return;
        }

        // 防止重复触发
        if (this.isExporting) {
            console.log("导出正在进行中，请稍候...");
            return;
        }

        this.isExporting = true;

        // 创建符合include.json格式的对象
        const exportData = [{
            "name": this.getTagFromUrl(),
            "type": "image",
            "items": []
        }];

        const selectedImages = Array.from(this.selectedImages);

        selectedImages.forEach(image => {
            exportData[0].items.push({
                "key": `${image.name}`,
                "val": image.url
            });
        });

        // 转换为格式化的JSON字符串
        const exportText = JSON.stringify(exportData, null, 2);

        // 创建Blob对象
        const blob = new Blob([exportText], { type: 'application/json;charset=utf-8' });

        // 创建下载链接
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `emoji-${Date.now()}.json`;

        // 触发下载
        document.body.appendChild(a);
        a.click();

        // 清理
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.isExporting = false; // 重置导出状态
        }, 100);
    }

    // 获取URL中的tag参数值，不存在则返回'all'
    getTagFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const tag = urlParams.get('tag');
        return tag || 'all';
    }
}

// 导出为全局变量
window.ImageSelect = ImageSelect; 