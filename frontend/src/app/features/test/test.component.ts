import {Component} from '@angular/core';
import {TestService} from '../../core/services/test.service';

@Component({
  selector: 'app-test',
  template: `
    <p>
      test works!

    </p>
  `,
  styles: [
  ]
})

export class TestComponent {
  constructor(private testService: TestService) {
  }

  ngOnInit(): void {
    this.testService.getTests().subscribe({
      next: (data: any) => console.log('Test data:', data),
      error: (err: any) => console.error('Error fetching test data:', err)
    });
  }
}
