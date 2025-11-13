/**
 * Toast Notification System
 * Displays beautiful toast notifications using Tailwind CSS
 */

class ToastManager {
  constructor() {
    this.container = this.createContainer();
  }

  createContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(container);
    return container;
  }

  /**
   * Show a toast notification
   * @param {string} message - The message to display
   * @param {string} type - 'success', 'error', 'warning', 'info'
   * @param {number} duration - Duration in milliseconds (default: 3000)
   */
  show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `pointer-events-auto transform transition-all duration-300 ease-in-out translate-x-full opacity-0 
      px-6 py-4 rounded-lg shadow-lg max-w-sm flex items-center gap-3 ${this.getTypeClasses(type)}`;
    
    // Icon
    const icon = document.createElement('div');
    icon.className = 'flex-shrink-0';
    icon.innerHTML = this.getIcon(type);
    
    // Message
    const messageEl = document.createElement('div');
    messageEl.className = 'flex-1 text-sm font-medium';
    messageEl.textContent = message;
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity';
    closeBtn.innerHTML = '×';
    closeBtn.style.fontSize = '1.5rem';
    closeBtn.onclick = () => this.remove(toast);
    
    toast.appendChild(icon);
    toast.appendChild(messageEl);
    toast.appendChild(closeBtn);
    
    this.container.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-full', 'opacity-0');
    }, 10);
    
    // Auto remove
    if (duration > 0) {
      setTimeout(() => {
        this.remove(toast);
      }, duration);
    }
    
    return toast;
  }

  remove(toast) {
    toast.classList.add('translate-x-full', 'opacity-0');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  getTypeClasses(type) {
    const classes = {
      success: 'bg-green-500 text-white',
      error: 'bg-red-500 text-white',
      warning: 'bg-yellow-500 text-white',
      info: 'bg-blue-500 text-white'
    };
    return classes[type] || classes.info;
  }

  getIcon(type) {
    const icons = {
      success: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>',
      error: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>',
      warning: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>',
      info: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
    };
    return icons[type] || icons.info;
  }

  success(message, duration = 3000) {
    return this.show(message, 'success', duration);
  }

  error(message, duration = 4000) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration = 3500) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration = 3000) {
    return this.show(message, 'info', duration);
  }
}

// Create singleton instance
const toast = new ToastManager();
export default toast;


