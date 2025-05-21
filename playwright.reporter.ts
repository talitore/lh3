import {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  FullResult,
} from '@playwright/test/reporter';

/**
 * Custom reporter that only shows final test results without in-progress logs
 */
class MinimalReporter implements Reporter {
  private passedTests: string[] = [];
  private failedTests: string[] = [];
  private skippedTests: string[] = [];
  private startTime: number = 0;

  onBegin(config: FullConfig, suite: Suite) {
    this.startTime = Date.now();
    // Only show a simple message at the beginning
    console.log(`Running ${suite.allTests().length} tests...`);
  }

  onTestBegin(test: TestCase) {
    // Don't log anything when test begins
  }

  onTestEnd(test: TestCase, result: TestResult) {
    // Store test results for summary at the end
    const testPath = test.parent.title
      ? `${test.parent.title} › ${test.title}`
      : test.title;

    if (result.status === 'passed') {
      this.passedTests.push(testPath);
    } else if (result.status === 'failed') {
      this.failedTests.push(testPath);

      // Log the error immediately for debugging
      console.log(`\n❌ FAILED: ${testPath}`);
      if (result.error) {
        console.log(`   Error: ${result.error.message || 'Unknown error'}`);
      }
    } else if (result.status === 'skipped') {
      this.skippedTests.push(testPath);
    }
  }

  onEnd(result: FullResult) {
    const duration = (Date.now() - this.startTime) / 1000;

    console.log('\n----- TEST RESULTS -----');
    console.log(
      `Total tests: ${
        this.passedTests.length +
        this.failedTests.length +
        this.skippedTests.length
      }`
    );
    console.log(`Passed: ${this.passedTests.length}`);
    console.log(`Failed: ${this.failedTests.length}`);
    console.log(`Skipped: ${this.skippedTests.length}`);
    console.log(`Duration: ${duration.toFixed(2)}s`);

    if (this.failedTests.length > 0) {
      console.log('\nFailed tests:');
      this.failedTests.forEach((test, index) => {
        console.log(`  ${index + 1}. ${test}`);
      });
    } else if (result.status === 'failed' && this.failedTests.length === 0) {
      console.log(
        '\nTests failed but no specific test failures were recorded.'
      );
      console.log('This might be due to setup failures or other issues.');
    }

    console.log(
      `\nTest run ${result.status === 'passed' ? 'PASSED' : 'FAILED'}`
    );
  }
}

export default MinimalReporter;
