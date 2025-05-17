import os
import shutil
import re
from flask import render_template
from app import app

# Configuration
BUILD_DIR = 'docs'  # GitHub Pages uses 'docs' folder
ROUTES = {
    '/': 'index.html',
    '/features': 'features.html',
    '/privacy-score': 'privacy_score.html',
    '/about': 'about.html',
    '/download': 'download.html',
    '/blog': 'blog.html'
}

# Configure Flask for URL generation without a request context
app.config['SERVER_NAME'] = 'example.com'  # This is just for URL generation, not actual serving

def ensure_dir(directory):
    """Make sure a directory exists."""
    if not os.path.exists(directory):
        os.makedirs(directory)

def copy_static_files():
    """Copy static files (CSS, JS) to the build directory."""
    static_src = os.path.join(os.path.dirname(__file__), 'static')
    static_dest = os.path.join(BUILD_DIR, 'static')
    
    # Ensure the static directory exists in the build folder
    ensure_dir(static_dest)
    
    # Copy CSS files
    if os.path.exists(os.path.join(static_src, 'css')):
        css_dest = os.path.join(static_dest, 'css')
        ensure_dir(css_dest)
        for file in os.listdir(os.path.join(static_src, 'css')):
            src_file = os.path.join(static_src, 'css', file)
            dest_file = os.path.join(css_dest, file)
            shutil.copy2(src_file, dest_file)
        print(f"CSS files copied to {css_dest}")
    
    # Copy JS files
    if os.path.exists(os.path.join(static_src, 'js')):
        js_dest = os.path.join(static_dest, 'js')
        ensure_dir(js_dest)
        for file in os.listdir(os.path.join(static_src, 'js')):
            src_file = os.path.join(static_src, 'js', file)
            dest_file = os.path.join(js_dest, file)
            shutil.copy2(src_file, dest_file)
        print(f"JS files copied to {js_dest}")

def fix_urls(content):
    """Fix URLs in HTML content to work with static files."""
    
    # Fix url_for links for routes
    for route_name, html_file in [('home', 'index.html'), ('features', 'features.html'), 
                                 ('privacy_score', 'privacy_score.html'), ('about', 'about.html'),
                                 ('download', 'download.html'), ('blog', 'blog.html')]:
        # Handle routes in href attributes
        pattern = f'href="https?://example.com/{route_name if route_name != "home" else ""}"'
        replacement = f'href="{html_file}"'
        content = re.sub(pattern, replacement, content)
        
        # Also handle the url_for pattern directly for safety
        pattern = f'href="{{{{ url_for\\(\'{route_name}\'[^\\)]*\\) }}}}"'
        content = re.sub(pattern, replacement, content)
    
    # Fix the root URL
    content = re.sub(r'href="https?://example.com"', 'href="index.html"', content)
    
    # Fix static resource links (CSS, JS, etc.)
    content = re.sub(
        r'(src|href)="https?://example.com/static/([^"]+)"',
        r'\1="static/\2"',
        content
    )
    
    # Also catch any that might still have the template syntax
    content = re.sub(
        r'(src|href)="{{ url_for\(\'static\', filename=\'([^\']+)\'\) }}"',
        r'\1="static/\2"',
        content
    )
    
    # Fix absolute paths in hrefs and srcs
    content = re.sub(
        r'(href|src)="/(static/[^"]+)"',
        r'\1="\2"',
        content
    )
    
    # Fix absolute paths for page links
    content = re.sub(r'href="/features"', r'href="features.html"', content)
    content = re.sub(r'href="/privacy-score"', r'href="privacy_score.html"', content)
    content = re.sub(r'href="/about"', r'href="about.html"', content)
    content = re.sub(r'href="/download"', r'href="download.html"', content)
    content = re.sub(r'href="/blog"', r'href="blog.html"', content)
    content = re.sub(r'href="/"', r'href="index.html"', content)
    
    return content

def generate_static_site():
    """Generate a static version of the Flask site."""
    # Map of routes to template files
    template_map = {
        '/': 'index.html',
        '/features': 'features.html',
        '/privacy-score': 'privacy_score.html',
        '/about': 'about.html',
        '/download': 'download.html',
        '/blog': 'blog.html'
    }
    
    # Ensure the build directory exists
    ensure_dir(BUILD_DIR)
    
    # Copy static files
    copy_static_files()
    
    # Generate HTML files for each template
    for route, template_name in template_map.items():
        output_filename = ROUTES[route]  # Get the output HTML filename
        output_file = os.path.join(BUILD_DIR, output_filename)
        
        try:
            # Render the template using Flask's render_template within an app context
            with app.test_request_context():
                with app.app_context():
                    html_content = render_template(template_name)
            
            # Fix URLs to work with static hosting
            fixed_content = fix_urls(html_content)
            
            # Write to file
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
            
            print(f"Generated: {output_file}")
        except Exception as e:
            print(f"Error generating {output_file}: {str(e)}")
    
    print(f"Static site successfully generated in the '{BUILD_DIR}' directory!")

if __name__ == '__main__':
    try:
        # Clean the build directory if it exists
        if os.path.exists(BUILD_DIR):
            shutil.rmtree(BUILD_DIR)
            print(f"Cleaned existing {BUILD_DIR} directory")
        
        # Generate the static site
        generate_static_site()
        
    except Exception as e:
        print(f"Error: {str(e)}")