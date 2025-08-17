# Raedam - Smart Parking Solutions

A modern, responsive website for Raedam's AI-powered parking platform. This is a conventional HTML website with consistent theming across all pages.

## 🚀 Features

- **Modern Design**: Clean, professional design with consistent theming
- **Responsive Layout**: Mobile-first approach with responsive grid systems
- **Interactive Elements**: Smooth animations, mobile navigation, and form handling
- **Performance Optimized**: Fast loading with optimized CSS and JavaScript
- **Accessibility**: Semantic HTML and ARIA labels for better accessibility

## 📁 Project Structure

```
public/
├── index.html          # Homepage
├── about.html          # About Us page
├── contact.html        # Contact page
├── early-access.html   # Early Access page
├── css/
│   ├── main.css        # Main styles and components
│   └── pages.css       # Additional page-specific styles
├── js/
│   └── main.js         # Main JavaScript functionality
└── images/             # Website images
```

## 🎨 Design System

### Colors
- **Primary**: Indigo (#6366f1)
- **Secondary**: Emerald (#10b981)
- **Accent**: Amber (#f59e0b)
- **Grays**: Full grayscale palette from 50-900

### Typography
- **Font Family**: Inter (Google Fonts)
- **Font Weights**: 300, 400, 500, 600, 700, 800
- **Responsive Sizing**: Scales from mobile to desktop

### Components
- **Buttons**: Primary, secondary, outline variants
- **Cards**: Feature cards, team member cards, step cards
- **Forms**: Contact form, early access signup
- **Navigation**: Desktop and mobile navigation
- **Footer**: Multi-column footer with newsletter signup

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Grid, Flexbox, animations
- **JavaScript**: Vanilla JS with ES6+ features
- **Fonts**: Google Fonts (Inter)
- **Icons**: SVG icons and emoji

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Front-Facing-Website
   ```

2. **Open in browser**
   - Simply open any HTML file in your web browser
   - Or use a local server for development

3. **Local Development Server** (optional)
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx serve public
   
   # Using PHP
   php -S localhost:8000 -t public
   ```

## 📝 Pages

### Homepage (`index.html`)
- Hero section with call-to-action
- Statistics showcase
- How it works process
- Feature highlights
- App preview
- Call-to-action section

### About (`about.html`)
- Company mission
- Core values
- Team members (organized by category)
- Company timeline
- Call-to-action

### Contact (`contact.html`)
- Contact information
- Contact form
- Social media links
- Google Maps integration
- Office location details

### Early Access (`early-access.html`)
- Benefits of early access
- Process explanation
- Signup form
- FAQ section
- Call-to-action

## 🎯 Key Features

### Mobile Navigation
- Hamburger menu for mobile devices
- Smooth slide-in animation
- Touch-friendly interface

### Interactive Elements
- Hover effects on cards and buttons
- Smooth scrolling to sections
- FAQ accordion functionality
- Form validation and feedback

### Performance
- CSS custom properties for consistent theming
- Optimized animations with CSS transforms
- Efficient JavaScript event handling
- Minimal external dependencies

## 🔧 Customization

### Colors
Update the CSS custom properties in `css/main.css`:
```css
:root {
  --primary: #6366f1;
  --secondary: #10b981;
  --accent: #f59e0b;
  /* ... other colors */
}
```

### Typography
Modify font settings in the CSS variables:
```css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  /* ... other typography settings */
}
```

### Spacing
Adjust the spacing scale:
```css
:root {
  --space-4: 1rem;
  --space-8: 2rem;
  --space-16: 4rem;
  /* ... other spacing values */
}
```

## 📱 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **CSS Features**: Grid, Flexbox, Custom Properties, Transitions
- **JavaScript**: ES6+ features with fallbacks

## 🚀 Deployment

### Static Hosting
- **Netlify**: Drag and drop the `public` folder
- **Vercel**: Connect your repository
- **GitHub Pages**: Push to `gh-pages` branch
- **Firebase Hosting**: Use Firebase CLI

### CDN
- Serve static assets through a CDN for better performance
- Optimize images and compress CSS/JS files

## 📊 Performance

- **Lighthouse Score**: 90+ on all metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across different devices and browsers
5. Submit a pull request

## 📄 License

This project is proprietary to Raedam. All rights reserved.

## 📞 Support

For questions or support, contact:
- **Email**: omar@raedam.co
- **Phone**: (426) 864-6296
- **Office**: 2828 South Corbett Avenue, Portland, OR 97201

---

**Raedam** - Revolutionizing urban mobility with AI-powered parking solutions.