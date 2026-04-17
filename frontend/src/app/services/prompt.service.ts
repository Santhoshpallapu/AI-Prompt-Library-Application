import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Prompt {
  id: number;
  title: string;
  content?: string;
  complexity: number;
  created_at: string;
  view_count?: number;
}

export interface CreatePromptPayload {
  title: string;
  content: string;
  complexity: number;
}

@Injectable({
  providedIn: 'root',
})
export class PromptService {
  private readonly baseUrl = 'https://ai-prompt-library-application-production.up.railway.app/api/prompts/';

  constructor(private readonly http: HttpClient) {}

  getPrompts(): Observable<Prompt[]> {
    return this.http.get<Prompt[]>(this.baseUrl);
  }

  getPrompt(id: string): Observable<Prompt> {
    return this.http.get<Prompt>(`${this.baseUrl}${id}/`);
  }

  createPrompt(payload: CreatePromptPayload): Observable<Prompt> {
    return this.http.post<Prompt>(this.baseUrl, payload);
  }
}
