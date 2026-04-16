import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Prompt, PromptService } from '../../services/prompt.service';

@Component({
  selector: 'app-prompt-detail',
  templateUrl: './prompt-detail.component.html',
  styleUrls: ['./prompt-detail.component.css'],
})
export class PromptDetailComponent implements OnInit {
  prompt: Prompt | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly promptService: PromptService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'Prompt id is missing from the URL.';
      this.isLoading = false;
      return;
    }

    this.promptService.getPrompt(id).subscribe({
      next: (prompt) => {
        this.prompt = prompt;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'We could not find that prompt.';
        this.isLoading = false;
      },
    });
  }

  getComplexityLabel(complexity: number): string {
    if (complexity <= 3) {
      return 'Low complexity';
    }

    if (complexity <= 7) {
      return 'Medium complexity';
    }

    return 'High complexity';
  }
}
