const fs = require('fs');
const path = require('path');

/**
 * Generates a markdown report from test results.
 */
class MarkdownReportGenerator {
  constructor() {
    this.reportPath = path.join(__dirname, '..', 'reports', 'test-summary.md');
    this.results = [];
  }

  addResult({ testName, status, duration, error, screenshot }) {
    this.results.push({ testName, status, duration, error, screenshot });
  }

  generate() {
    const reportsDir = path.join(__dirname, '..', 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const totalTests = this.results.length;
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;

    let markdown = `# AI Autonomous Testing Framework - Test Report\n\n`;
    markdown += `**Run Date:** ${new Date().toLocaleString()}\n\n`;
    markdown += `## Summary\n\n`;
    markdown += `- **Total Tests:** ${totalTests}\n`;
    markdown += `- **✅ Passed:** ${passed}\n`;
    markdown += `- **❌ Failed:** ${failed}\n\n`;

    markdown += `## Test Details\n\n`;
    markdown += `| Test Case | Status | Duration | Screenshot |\n`;
    markdown += `| :--- | :--- | :--- | :--- |\n`;

    this.results.forEach(res => {
      const statusIcon = res.status === 'passed' ? '✅' : '❌';
      const screenshotLink = res.screenshot ? `[View Screenshot](../screenshots/${path.basename(res.screenshot)})` : 'N/A';
      markdown += `| ${res.testName} | ${statusIcon} ${res.status} | ${res.duration}ms | ${screenshotLink} |\n`;
    });

    if (failed > 0) {
      markdown += `\n## Error Logs\n\n`;
      this.results.filter(r => r.status === 'failed').forEach(res => {
        markdown += `### ${res.testName}\n\n`;
        markdown += `\`\`\`\n${res.error}\n\`\`\`\n\n`;
      });
    }

    fs.writeFileSync(this.reportPath, markdown);
    console.log(`Markdown report generated at: ${this.reportPath}`);
  }
}

module.exports = new MarkdownReportGenerator();
