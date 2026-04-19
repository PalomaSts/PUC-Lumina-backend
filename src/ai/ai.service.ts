import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async suggestTasks(projectName: string): Promise<string[]> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: `
              Considere um projeto chamado "${projectName}".
              
              Gere 3 tarefas práticas, específicas e úteis para esse projeto.
              Evite tarefas genéricas.
              Responda em lista, uma por linha.
              `,
          },
        ],
      });

      const text = response.choices[0].message.content || '';

      return text
        .split('\n')
        .map((t) => t.replace(/^\d+[\).\-\s]*/, '').trim())
        .filter((t) => t.length > 5)
        .slice(0, 5);
    } catch (error) {
      console.error('Erro IA:', error);

      return [
        `Definir metas do projeto "${projectName}"`,
        `Criar plano inicial de execução`,
        `Organizar tarefas principais`,
      ];
    }
  }
}
