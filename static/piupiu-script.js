(async function() {
    if (globalThis.injected) return;
    globalThis.injected = true;
    const ball = document.createElement('div');
    document.body.appendChild(ball);
    let isDragging = false;
    let startX, startY;
    let initialX, initialY;

        // 核心拖动逻辑
        function dragStart(e) {
            isDragging = true;
            // 兼容触摸屏
            const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

            startX = clientX;
            startY = clientY;
            
            // 获取悬浮球当前的实际相对于窗口的坐标
            const rect = ball.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;

            // 清除原本的右/下定位，统一改用 left 和 top，防止定位冲突
            ball.style.right = 'auto';
            ball.style.bottom = 'auto';
            ball.style.transition = 'none'; // 拖动时关闭动画过渡，保证丝滑
        }

        function dragMove(e) {
            if (!isDragging) return;
            e.preventDefault(); // 阻止手机端拖动时页面跟着滚动的默认行为

            const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

            // 计算位移量
            const dx = clientX - startX;
            const dy = clientY - startY;

            // 计算新的位置
            let newX = initialX + dx;
            let newY = initialY + dy;

            // 【边界限制】防止悬浮球飞出屏幕外
            const minX = 0;
            const maxX = window.innerWidth - ball.offsetWidth;
            const minY = 0;
            const maxY = window.innerHeight - ball.offsetHeight;

            if (newX < minX) newX = minX;
            if (newX > maxX) newX = maxX;
            if (newY < minY) newY = minY;
            if (newY > maxY) newY = maxY;

            // 赋值更新位置
            ball.style.left = newX + 'px';
            ball.style.top = newY + 'px';
        }

        function dragEnd() {
            if (!isDragging) return;
            isDragging = false;

            // 【吸附边缘功能】
            ball.style.transition = 'all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)'; // 开启弹性吸附动画
            const rect = ball.getBoundingClientRect();
            const screenWidth = window.innerWidth;
            
            // 如果悬浮球中心点在屏幕左半边，就吸附到左边；否则吸附到右边
            if ((rect.left + rect.width / 2) < screenWidth / 2) {
                ball.style.left = '10px'; // 留点边距
            } else {
                ball.style.left = (screenWidth - rect.width - 10) + 'px';
            }
        }

        // 绑定鼠标事件 (PC端)
        ball.addEventListener('mousedown', dragStart);
        window.addEventListener('mousemove', dragMove);
        window.addEventListener('mouseup', dragEnd);

        // 绑定触摸事件 (手机端)
        ball.addEventListener('touchstart', dragStart, { passive: false });
        window.addEventListener('touchmove', dragMove, { passive: false });
        window.addEventListener('touchend', dragEnd);
})();