import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { PromptService } from '../../services/prompt.service';

@Component({
  selector: 'app-add-prompt',
  templateUrl: './add-prompt.component.html',
  styleUrls: ['./add-prompt.component.css'],
})
export class AddPromptComponent {
  isSubmitting = false;
  formError = '';

  promptForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(3), this.urlTitleValidator]],
    content: ['', [Validators.required, Validators.minLength(20)]],
    complexity: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly promptService: PromptService,
    private readonly router: Router
  ) {}

  submitForm(): void {
    if (this.promptForm.invalid) {
      this.promptForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.formError = '';

    this.promptService.createPrompt(this.promptForm.getRawValue() as {
      title: string;
      content: string;
      complexity: number;
    }).subscribe({
      next: (prompt) => {
        this.isSubmitting = false;
        this.router.navigate(['/prompts', prompt.id]);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.formError =
          error?.error?.errors?.title?.[0] ||
          error?.error?.errors?.content?.[0] ||
          error?.error?.errors?.complexity?.[0] ||
          'Something went wrong while saving the prompt.';
      },
    });
  }

  get title() {
    return this.promptForm.get('title');
  }

  get content() {
    return this.promptForm.get('content');
  }

  get complexity() {
    return this.promptForm.get('complexity');
  }

  private urlTitleValidator(control: AbstractControl): ValidationErrors | null {
    const value = String(control.value || '').trim().toLowerCase();

    if (value.startsWith('http://') || value.startsWith('https://')) {
      return { urlTitle: true };
    }

    return null;
  }
}
