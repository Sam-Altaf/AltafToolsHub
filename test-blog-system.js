// Comprehensive Blog System Test Script
const puppeteer = require('puppeteer');

async function testBlogSystem() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  // Set viewport for desktop and mobile testing
  const viewports = {
    desktop: { width: 1920, height: 1080 },
    mobile: { width: 375, height: 667 }
  };
  
  const results = {
    blogListingPage: { errors: [], warnings: [], issues: [] },
    individualPosts: {},
    searchFunctionality: { errors: [], issues: [] },
    categoryFiltering: { errors: [], issues: [] },
    navigation: { errors: [], issues: [] },
    mobileResponsiveness: { errors: [], issues: [] },
    performance: {},
    guidesPage: { errors: [], issues: [] },
    consoleErrors: [],
    overallStatus: 'PENDING'
  };

  // Capture console messages
  page.on('console', msg => {
    if (msg.type() === 'error') {
      results.consoleErrors.push({
        text: msg.text(),
        location: msg.location(),
        timestamp: new Date().toISOString()
      });
    }
  });

  try {
    // Test 1: Blog listing page
    console.log('Testing Blog Listing Page...');
    await page.goto('http://localhost:5000/blog', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(2000);
    
    // Check if blog posts are displayed
    const blogPosts = await page.$$('[data-testid^="blog-featured"], [data-testid^="blog-post"]');
    if (blogPosts.length === 0) {
      results.blogListingPage.issues.push('No blog posts found on listing page');
    } else {
      results.blogListingPage.blogPostCount = blogPosts.length;
    }
    
    // Check for search bar
    const searchBar = await page.$('[data-testid="input-blog-search"]');
    if (!searchBar) {
      results.blogListingPage.issues.push('Search bar not found');
    }
    
    // Check for categories
    const categories = await page.$$('[data-testid^="blog-category"]');
    results.blogListingPage.categoryCount = categories.length;

    // Test 2: Individual blog posts
    const testPosts = [
      'how-to-compress-pdf-without-losing-quality',
      'how-to-merge-pdf-files',
      'how-to-split-pdf'
    ];
    
    for (const slug of testPosts) {
      console.log(`Testing blog post: ${slug}...`);
      results.individualPosts[slug] = { errors: [], issues: [] };
      
      try {
        await page.goto(`http://localhost:5000/blog/${slug}`, { waitUntil: 'networkidle2' });
        await page.waitForTimeout(1500);
        
        // Check breadcrumbs
        const breadcrumbs = await page.$('nav[aria-label="Breadcrumb"]');
        if (!breadcrumbs) {
          results.individualPosts[slug].issues.push('Breadcrumbs not found');
        }
        
        // Check content
        const content = await page.$('article, [role="article"], .prose');
        if (!content) {
          results.individualPosts[slug].issues.push('Article content not found');
        }
        
        // Check related articles
        const relatedArticles = await page.$$('[data-testid^="related-post"]');
        results.individualPosts[slug].relatedArticlesCount = relatedArticles.length;
        
        // Check navigation links
        const prevLink = await page.$('[data-testid="button-prev-post"]');
        const nextLink = await page.$('[data-testid="button-next-post"]');
        results.individualPosts[slug].hasNavigation = {
          prev: !!prevLink,
          next: !!nextLink
        };
        
      } catch (error) {
        results.individualPosts[slug].errors.push(error.message);
      }
    }
    
    // Test 5: Search functionality
    console.log('Testing search functionality...');
    await page.goto('http://localhost:5000/blog', { waitUntil: 'networkidle2' });
    const searchInput = await page.$('[data-testid="input-blog-search"]');
    if (searchInput) {
      await searchInput.type('compress');
      await page.waitForTimeout(1000);
      const searchResults = await page.$$('[data-testid^="blog-"]');
      results.searchFunctionality.searchResultCount = searchResults.length;
    }
    
    // Test 6: Category filtering
    console.log('Testing category filtering...');
    const categoryButtons = await page.$$('[data-testid^="blog-category"]');
    if (categoryButtons.length > 0) {
      await categoryButtons[0].click();
      await page.waitForTimeout(1000);
      const filteredPosts = await page.$$('[data-testid^="blog-"]');
      results.categoryFiltering.filteredPostCount = filteredPosts.length;
    }
    
    // Test 7: Mobile responsiveness
    console.log('Testing mobile responsiveness...');
    await page.setViewport(viewports.mobile);
    await page.goto('http://localhost:5000/blog', { waitUntil: 'networkidle2' });
    
    // Check for horizontal scrolling
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    if (hasHorizontalScroll) {
      results.mobileResponsiveness.issues.push('Horizontal scrolling detected on mobile');
    }
    
    // Test a blog post on mobile
    await page.goto('http://localhost:5000/blog/how-to-compress-pdf-without-losing-quality', { waitUntil: 'networkidle2' });
    const mobileHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    if (mobileHorizontalScroll) {
      results.mobileResponsiveness.issues.push('Horizontal scrolling on blog post mobile view');
    }
    
    // Reset to desktop viewport
    await page.setViewport(viewports.desktop);
    
    // Test 8: Performance metrics
    console.log('Checking performance metrics...');
    await page.goto('http://localhost:5000/blog', { waitUntil: 'networkidle2' });
    const perfMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        ttfb: navigation.responseStart - navigation.requestStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart
      };
    });
    results.performance = perfMetrics;
    
    // Test 9: Navigation flow
    console.log('Testing navigation flow...');
    await page.goto('http://localhost:5000', { waitUntil: 'networkidle2' });
    
    // Navigate to blog
    const blogLink = await page.$('a[href="/blog"]');
    if (blogLink) {
      await blogLink.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      
      // Click on a blog post
      const firstPost = await page.$('[data-testid^="blog-post"], [data-testid^="blog-featured"]');
      if (firstPost) {
        await firstPost.click();
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        
        // Go back to blog
        const backButton = await page.$('[data-testid="button-back-to-blog"]');
        if (backButton) {
          await backButton.click();
          await page.waitForTimeout(1000);
          results.navigation.flowComplete = true;
        } else {
          results.navigation.issues.push('Back to blog button not found');
        }
      }
    }
    
    // Test 10: Guides page
    console.log('Testing Guides page...');
    await page.goto('http://localhost:5000/guides', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(1500);
    
    const guideCards = await page.$$('[data-testid^="guide-card"]');
    results.guidesPage.guideCardCount = guideCards.length;
    
    if (guideCards.length !== 17) {
      results.guidesPage.issues.push(`Expected 17 guide cards, found ${guideCards.length}`);
    }
    
    // Determine overall status
    const hasErrors = results.consoleErrors.length > 0 ||
                     Object.values(results.individualPosts).some(p => p.errors.length > 0) ||
                     results.blogListingPage.errors.length > 0;
    
    const hasIssues = results.blogListingPage.issues.length > 0 ||
                     Object.values(results.individualPosts).some(p => p.issues.length > 0) ||
                     results.mobileResponsiveness.issues.length > 0 ||
                     results.guidesPage.issues.length !== 0;
    
    results.overallStatus = hasErrors ? 'FAILED' : (hasIssues ? 'WARNING' : 'PASSED');
    
  } catch (error) {
    console.error('Test execution error:', error);
    results.overallStatus = 'ERROR';
    results.executionError = error.message;
  } finally {
    await browser.close();
  }
  
  return results;
}

// Run the tests
testBlogSystem().then(results => {
  console.log('\n=== BLOG SYSTEM TEST RESULTS ===\n');
  console.log(JSON.stringify(results, null, 2));
  
  // Print summary
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Overall Status: ${results.overallStatus}`);
  
  if (results.consoleErrors.length > 0) {
    console.log(`\n⚠️ Console Errors Found: ${results.consoleErrors.length}`);
    results.consoleErrors.forEach(err => {
      console.log(`  - ${err.text}`);
    });
  }
  
  if (results.blogListingPage.issues.length > 0) {
    console.log('\n⚠️ Blog Listing Issues:');
    results.blogListingPage.issues.forEach(issue => {
      console.log(`  - ${issue}`);
    });
  }
  
  Object.entries(results.individualPosts).forEach(([slug, data]) => {
    if (data.errors.length > 0 || data.issues.length > 0) {
      console.log(`\n⚠️ Issues in ${slug}:`);
      data.errors.forEach(err => console.log(`  - ERROR: ${err}`));
      data.issues.forEach(issue => console.log(`  - ISSUE: ${issue}`));
    }
  });
  
  if (results.performance) {
    console.log('\n📊 Performance Metrics:');
    console.log(`  - TTFB: ${results.performance.ttfb}ms`);
    console.log(`  - DOM Content Loaded: ${results.performance.domContentLoaded}ms`);
    console.log(`  - Load Complete: ${results.performance.loadComplete}ms`);
  }
  
  process.exit(results.overallStatus === 'PASSED' ? 0 : 1);
}).catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});