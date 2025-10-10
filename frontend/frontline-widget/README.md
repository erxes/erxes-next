# Erxes Chat Widget

A modern, responsive chat widget built with React and erxes-ui components.

## 🚀 Features

- **Modern UI**: Built with erxes-ui design system
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Chat**: Interactive messaging interface
- **Easy Integration**: Simple script tag integration
- **Customizable**: Themeable with CSS variables
- **Lightweight**: Optimized bundle size

## 📦 Quick Start

### 1. Basic Integration

Add the widget to any HTML page:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Your Website</title>
  </head>
  <body>
    <!-- Your website content -->

    <!-- Widget Container -->
    <div id="erxes-chat-widget"></div>

    <!-- Widget Script -->
    <script src="YOUR_R2_BUCKET_URL/main.js"></script>
    <script>
      window.ChatWidget.mount(document.getElementById('erxes-chat-widget'));
    </script>
  </body>
</html>
```

### 2. Async Loading (Recommended)

For better performance, load the widget asynchronously:

```html
<div id="erxes-chat-widget"></div>

<script>
  (function () {
    const script = document.createElement('script');
    script.src = 'YOUR_R2_BUCKET_URL/main.js';
    script.async = true;
    script.onload = function () {
      if (window.ChatWidget) {
        window.ChatWidget.mount(document.getElementById('erxes-chat-widget'));
      }
    };
    script.onerror = function () {
      console.error('Failed to load Erxes chat widget');
    };
    document.head.appendChild(script);
  })();
</script>
```

### 3. Conditional Loading

Load the widget based on user behavior:

```javascript
// Load widget after user scrolls 50% of the page
let widgetLoaded = false;

window.addEventListener('scroll', function () {
  const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);

  if (scrollPercent > 0.5 && !widgetLoaded) {
    loadChatWidget();
    widgetLoaded = true;
  }
});

function loadChatWidget() {
  const script = document.createElement('script');
  script.src = 'YOUR_R2_BUCKET_URL/main.js';
  script.onload = function () {
    window.ChatWidget.mount(document.getElementById('erxes-chat-widget'));
  };
  document.head.appendChild(script);
}
```

## 🎨 Customization

### Theme Colors

The widget uses CSS variables for theming. You can customize colors by adding CSS:

```css
:root {
  --primary: 244 76% 59%; /* Main brand color */
  --primary-foreground: 0 0% 100%; /* Text on primary color */
  --background: 0 0% 100%; /* Widget background */
  --foreground: 240 6% 10%; /* Main text color */
  --muted: 0 0% 95%; /* Muted backgrounds */
  --muted-foreground: 0 2% 45%; /* Muted text */
  --border: 240 6% 90%; /* Border color */
}

/* Dark mode */
.dark {
  --background: 0 0% 9%;
  --foreground: 240 6% 97%;
  --primary: 244 76% 59%;
  --primary-foreground: 0 0% 100%;
  --muted: 0 0% 14%;
  --muted-foreground: 0 2% 64%;
  --border: 240 6% 19%;
}
```

### Widget Position

Customize the widget position:

```css
/* Move widget to left side */
#erxes-chat-widget .widget-button {
  left: 20px !important;
  right: auto !important;
}

/* Adjust bottom spacing */
#erxes-chat-widget .widget-button {
  bottom: 100px !important;
}
```

## 🔧 Development

### Building the Widget

```bash
# Build for production
nx build frontline-widget

# Build for development
nx build frontline-widget --configuration=development
```

### Testing Locally

1. Build the widget:

   ```bash
   nx build frontline-widget
   ```

2. Serve the built files:

   ```bash
   # Using Python
   cd dist/frontend/frontline-widget
   python -m http.server 8000

   # Using Node.js
   npx serve dist/frontend/frontline-widget
   ```

3. Update test files to use local URL:
   ```javascript
   const WIDGET_SCRIPT_URL = 'http://localhost:8000/main.js';
   ```

## 📁 Files

- `test.html` - Simple test page with error handling
- `integration-example.html` - Comprehensive integration examples
- `src/Widget.tsx` - Main widget component
- `src/main.tsx` - Widget entry point and mount function
- `src/styles.css` - Widget styles and CSS variables

## 🌐 Deployment

### Cloudflare R2 Setup

1. Build the widget:

   ```bash
   nx build frontline-widget --configuration=production
   ```

2. Upload `dist/frontend/frontline-widget/main.js` to your R2 bucket

3. Update your integration code with the R2 URL:
   ```javascript
   const WIDGET_SCRIPT_URL = 'https://your-bucket.r2.dev/main.js';
   ```

### CDN Configuration

For better performance, configure your R2 bucket with:

- **Cache-Control**: `public, max-age=31536000` (1 year)
- **Content-Type**: `application/javascript`
- **CORS Headers**: Allow your domains

## 🐛 Troubleshooting

### Widget Not Loading

1. Check browser console for errors
2. Verify the script URL is accessible
3. Ensure CORS is properly configured
4. Check if container element exists

### Styling Issues

1. Verify CSS variables are defined
2. Check for CSS conflicts with your site
3. Use browser dev tools to inspect styles
4. Ensure the widget container has proper positioning

### Common Issues

```javascript
// Issue: ChatWidget is undefined
// Solution: Wait for script to load
script.onload = function () {
  if (window.ChatWidget) {
    window.ChatWidget.mount(container);
  }
};

// Issue: Container not found
// Solution: Wait for DOM ready
document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('erxes-chat-widget');
  if (container && window.ChatWidget) {
    window.ChatWidget.mount(container);
  }
});
```

## 📞 Support

For issues and questions:

1. Check the browser console for error messages
2. Verify your integration code matches the examples
3. Test with the provided HTML files
4. Check network tab for failed requests

## 🔄 Updates

When updating the widget:

1. Build new version
2. Upload to R2 with cache-busting (e.g., `main.v2.js`)
3. Update integration code
4. Test thoroughly before deploying
