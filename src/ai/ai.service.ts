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
              
              Gere 3 tarefas curtas e objetivas para esse projeto.
              
              Regras:
              - Cada tarefa deve ter no máximo 6 palavras
              - Não explique, apenas escreva a tarefa
              - Não use frases longas
              - Não use pontuação desnecessária
              - Escreva como títulos de tarefas
              - Uma tarefa por linha
              
              Exemplo de formato:
              Criar plano de treino
              Definir metas mensais
              Organizar rotina semanal
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
