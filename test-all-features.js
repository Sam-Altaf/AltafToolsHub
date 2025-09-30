#!/usr/bin/env node

const http = require('http');

class ComprehensiveTester {
    constructor() {
        this.testResults = {
            blog: {},
            blogPosts: {},
            tools: {},
            performance: {},
            navigation: {},
            overall: { passed: 0, failed: 0, warnings: 0 }
        };
    }

    async fetchPage(url) {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'localhost',
                port: 5000,
                path: url,
                method: 'GET'
            };

            const req = http.request(options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve({ 
                    html: data, 
                    statusCode: res.statusCode,
                    headers: res.headers 
                }));
            });

            req.on('error', reject);
            req.setTimeout(5000, () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });
            req.end();
        });
    }

    async testBlogPage() {
        console.log('\n📄 Testing Blog Page Features...');
        
        try {
            const { html, statusCode } = await this.fetchPage('/blog');
            
            const tests = {
                'Page loads successfully': statusCode === 200,
                'Blog cards present': html.includes('card') || html.includes('Card'),
                'Thumbnail images': html.includes('thumb.png') || html.includes('thumbnail'),
                'Search functionality': html.includes('input-blog-search') || html.includes('Search'),
                'Category filters': html.includes('blog-category') || html.includes('Category'),
                'Hover effects CSS': html.includes('hover:') || html.includes(':hover'),
                'Featured posts section': html.includes('Featured') || html.includes('featured'),
                'Load more button': html.includes('Load More') || html.includes('load-more'),
                'Blog post links': html.includes('/blog/') && html.includes('href')
            };

            for (const [test, passed] of Object.entries(tests)) {
                this.logResult(test, passed);
                this.testResults.blog[test] = passed;
            }
        } catch (error) {
            console.error('❌ Blog page test failed:', error.message);
            this.testResults.blog.error = error.message;
            this.testResults.overall.failed++;
        }
    }

    async testBlogPost() {
        console.log('\n📝 Testing Blog Post Features...');
        
        const posts = [
            '/blog/compress-pdf-without-losing-quality',
            '/blog/jpg-to-pdf-best-practices',
            '/blog/merge-pdf-files-guide'
        ];

        for (const post of posts) {
            console.log(`\n  Testing ${post}...`);
            
            try {
                const { html, statusCode } = await this.fetchPage(post);
                
                const tests = {
                    'Post loads successfully': statusCode === 200,
                    'Hero image present': html.includes('hero.png') || html.includes('hero-image'),
                    'Table of Contents': html.includes('Table of Contents') || html.includes('toc'),
                    'Reading progress bar': html.includes('reading-progress') || html.includes('readingProgress'),
                    'Social share buttons': html.includes('share') && (html.includes('twitter') || html.includes('linkedin')),
                    'Related Tools section': html.includes('Related Tools') || html.includes('related-tools'),
                    'Author information': html.includes('author') || html.includes('Author'),
                    'Publishing date': html.includes('date') || html.includes('Date'),
                    'Back to blog link': html.includes('/blog') && html.includes('Back'),
                    'Alt text for images': html.includes('alt=')
                };

                for (const [test, passed] of Object.entries(tests)) {
                    this.logResult(`  ${test}`, passed);
                    if (!this.testResults.blogPosts[post]) {
                        this.testResults.blogPosts[post] = {};
                    }
                    this.testResults.blogPosts[post][test] = passed;
                }
            } catch (error) {
                console.error(`❌ Blog post ${post} test failed:`, error.message);
                this.testResults.blogPosts[post] = { error: error.message };
                this.testResults.overall.failed++;
            }
        }
    }

    async testTools() {
        console.log('\n🛠️ Testing Tool Functionality...');
        
        const tools = [
            { 
                name: 'Compress PDF', 
                url: '/compress-pdf',
                checks: ['file-upload', 'Compress PDF', 'compression-level', 'Download']
            },
            { 
                name: 'JPG to PDF', 
                url: '/jpg-to-pdf',
                checks: ['file-upload', 'Convert to PDF', 'page-size', 'orientation']
            },
            { 
                name: 'QR Generator', 
                url: '/qr-generator',
                checks: ['input', 'Generate QR', 'download', 'color-picker']
            }
        ];

        for (const tool of tools) {
            console.log(`\n  Testing ${tool.name}...`);
            
            try {
                const { html, statusCode } = await this.fetchPage(tool.url);
                
                const tests = {
                    'Tool page loads': statusCode === 200,
                    'No JavaScript errors in HTML': !html.includes('Error') || !html.includes('undefined'),
                    'Upload/Input component': tool.checks.some(check => html.toLowerCase().includes(check.toLowerCase())),
                    'Action buttons present': html.includes('button'),
                    'Instructions present': html.includes('How it works') || html.includes('steps'),
                    'Privacy notice': html.includes('Privacy') || html.includes('privacy'),
                    'Breadcrumbs navigation': html.includes('breadcrumb') || html.includes('Home'),
                    'Tool features section': html.includes('Features') || html.includes('Why use')
                };

                for (const [test, passed] of Object.entries(tests)) {
                    this.logResult(`  ${test}`, passed);
                    if (!this.testResults.tools[tool.name]) {
                        this.testResults.tools[tool.name] = {};
                    }
                    this.testResults.tools[tool.name][test] = passed;
                }
            } catch (error) {
                console.error(`❌ Tool ${tool.name} test failed:`, error.message);
                this.testResults.tools[tool.name] = { error: error.message };
                this.testResults.overall.failed++;
            }
        }
    }

    async testPerformance() {
        console.log('\n⚡ Testing Performance & Load Times...');
        
        const pages = [
            { name: 'Homepage', url: '/' },
            { name: 'Blog', url: '/blog' },
            { name: 'All Tools', url: '/all-tools' },
            { name: 'Compress PDF', url: '/compress-pdf' }
        ];

        for (const page of pages) {
            const startTime = Date.now();
            
            try {
                const { html, statusCode } = await this.fetchPage(page.url);
                const loadTime = Date.now() - startTime;
                
                const tests = {
                    'Page loads under 2s': loadTime < 2000,
                    'Status code 200': statusCode === 200,
                    'No console errors in HTML': !html.includes('console.error'),
                    'Mobile viewport meta tag': html.includes('viewport'),
                    'No horizontal scroll CSS': !html.includes('overflow-x: scroll')
                };

                console.log(`\n  ${page.name} (${loadTime}ms):`);
                
                for (const [test, passed] of Object.entries(tests)) {
                    this.logResult(`    ${test}`, passed);
                    if (!this.testResults.performance[page.name]) {
                        this.testResults.performance[page.name] = { loadTime };
                    }
                    this.testResults.performance[page.name][test] = passed;
                }
            } catch (error) {
                console.error(`❌ Performance test for ${page.name} failed:`, error.message);
                this.testResults.performance[page.name] = { error: error.message };
                this.testResults.overall.failed++;
            }
        }
    }

    async testNavigation() {
        console.log('\n🧭 Testing Navigation Flows...');
        
        const flows = [
            { name: 'Homepage → Blog', from: '/', to: '/blog' },
            { name: 'Blog → Blog Post', from: '/blog', to: '/blog/compress-pdf-without-losing-quality' },
            { name: 'Blog Post → Tool', from: '/blog/compress-pdf-without-losing-quality', to: '/compress-pdf' },
            { name: 'Homepage → All Tools', from: '/', to: '/all-tools' },
            { name: 'All Tools → Specific Tool', from: '/all-tools', to: '/jpg-to-pdf' }
        ];

        for (const flow of flows) {
            try {
                const fromPage = await this.fetchPage(flow.from);
                const toPage = await this.fetchPage(flow.to);
                
                const passed = fromPage.statusCode === 200 && toPage.statusCode === 200;
                this.logResult(`  ${flow.name}`, passed);
                
                this.testResults.navigation[flow.name] = {
                    fromStatus: fromPage.statusCode,
                    toStatus: toPage.statusCode,
                    passed
                };
            } catch (error) {
                console.error(`❌ Navigation ${flow.name} failed:`, error.message);
                this.testResults.navigation[flow.name] = { error: error.message };
                this.testResults.overall.failed++;
            }
        }
    }

    logResult(test, passed) {
        const icon = passed ? '✅' : '❌';
        const status = passed ? 'PASS' : 'FAIL';
        
        console.log(`  ${icon} ${test}: ${status}`);
        
        if (passed) {
            this.testResults.overall.passed++;
        } else {
            this.testResults.overall.failed++;
        }
    }

    async runAllTests() {
        console.log('🧪 COMPREHENSIVE TESTING SUITE - AltafToolsHub');
        console.log('='.repeat(50));
        console.log(`Started: ${new Date().toLocaleString()}`);
        console.log('='.repeat(50));

        await this.testBlogPage();
        await this.testBlogPost();
        await this.testTools();
        await this.testPerformance();
        await this.testNavigation();

        this.generateReport();
    }

    generateReport() {
        console.log('\n' + '='.repeat(50));
        console.log('📊 FINAL TEST REPORT');
        console.log('='.repeat(50));
        
        console.log(`\n✅ Passed: ${this.testResults.overall.passed}`);
        console.log(`❌ Failed: ${this.testResults.overall.failed}`);
        console.log(`⚠️  Warnings: ${this.testResults.overall.warnings}`);
        
        const successRate = (this.testResults.overall.passed / 
            (this.testResults.overall.passed + this.testResults.overall.failed) * 100).toFixed(1);
        
        console.log(`\n📈 Success Rate: ${successRate}%`);
        
        if (successRate >= 90) {
            console.log('\n🎉 EXCELLENT! All major features are working correctly.');
        } else if (successRate >= 70) {
            console.log('\n⚠️  GOOD: Most features work, but some issues need attention.');
        } else {
            console.log('\n🚨 NEEDS ATTENTION: Several features have issues.');
        }

        // Save detailed report to file
        const fs = require('fs');
        fs.writeFileSync('test-report.json', JSON.stringify(this.testResults, null, 2));
        console.log('\n📄 Detailed report saved to test-report.json');
        
        // Create markdown report
        this.createMarkdownReport();
    }

    createMarkdownReport() {
        const fs = require('fs');
        
        let markdown = `# Comprehensive Test Report - AltafToolsHub
        
**Date:** ${new Date().toLocaleString()}

## Summary
- ✅ **Passed:** ${this.testResults.overall.passed}
- ❌ **Failed:** ${this.testResults.overall.failed}
- 📈 **Success Rate:** ${(this.testResults.overall.passed / (this.testResults.overall.passed + this.testResults.overall.failed) * 100).toFixed(1)}%

## Blog Page Testing
${this.formatMarkdownSection(this.testResults.blog)}

## Blog Posts Testing
${Object.entries(this.testResults.blogPosts).map(([post, results]) => 
    `### ${post}\n${this.formatMarkdownSection(results)}`
).join('\n')}

## Tools Testing
${Object.entries(this.testResults.tools).map(([tool, results]) => 
    `### ${tool}\n${this.formatMarkdownSection(results)}`
).join('\n')}

## Performance Testing
${Object.entries(this.testResults.performance).map(([page, results]) => 
    `### ${page}\n${this.formatMarkdownSection(results)}`
).join('\n')}

## Navigation Testing
${this.formatMarkdownSection(this.testResults.navigation)}

## Conclusion
${this.testResults.overall.failed === 0 ? 
    '✅ **All tests passed successfully!** The blog enhancements and tools are working correctly.' :
    '⚠️ **Some tests failed.** Please review the failures above and address any critical issues.'}
`;

        fs.writeFileSync('test-report.md', markdown);
        console.log('📄 Markdown report saved to test-report.md');
    }

    formatMarkdownSection(results) {
        return Object.entries(results)
            .filter(([key]) => key !== 'error')
            .map(([test, passed]) => {
                if (typeof passed === 'object') {
                    return `- **${test}:** ${JSON.stringify(passed)}`;
                }
                return `- ${passed ? '✅' : '❌'} ${test}`;
            })
            .join('\n');
    }
}

// Run the tests
const tester = new ComprehensiveTester();
tester.runAllTests().catch(console.error);