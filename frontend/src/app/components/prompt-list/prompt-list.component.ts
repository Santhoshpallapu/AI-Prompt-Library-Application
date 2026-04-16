import { Component, OnInit } from '@angular/core';

import { Prompt, PromptService } from '../../services/prompt.service';

@Component({
  selector: 'app-prompt-list',
  templateUrl: './prompt-list.component.html',
  styleUrls: ['./prompt-list.component.css'],
})
export class PromptListComponent implements OnInit {
  prompts: Prompt[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private readonly promptService: PromptService) {}

  ngOnInit(): void {
    this.promptService.getPrompts().subscribe({
      next: (prompts) => {
        this.prompts = prompts;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load prompts right now. Please try again in a moment.';
        this.isLoading = false;
      },
    });
  }

  getComplexityLabel(complexity: number): string {
    if (complexity <= 3) {
      return 'Low';
    }

    if (complexity <= 7) {
      return 'Medium';
    }

    return 'High';
  }

  getComplexityClass(complexity: number): string {
    if (complexity <= 3) {
      return 'low';
    }

    if (complexity <= 7) {
      return 'medium';
    }

    return 'high';
  }
}
