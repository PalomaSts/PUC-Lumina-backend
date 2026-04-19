import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  async suggestTasks(projectName: string): Promise<string[]> {
    try {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/google/flan-t5-base',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.HF_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: `
              Considere um projeto chamado "${projectName}".
              
              Se for um projeto pessoal, sugira tarefas práticas do dia a dia.
              Se for profissional, sugira tarefas organizacionais e de execução.
              
              Gere 3 tarefas úteis e específicas.
              Responda em lista.
              `,
            options: {
              wait_for_model: true,
            },
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('HF ERROR:', errorText);
        throw new Error(`HF Error: ${response.status}`);
      }

      const data: any = await response.json();
      const text = data?.[0]?.generated_text || '';

      // 🔥 parsing mais inteligente
      const tasks = text
        .split('\n')
        .map((t: string) =>
          t
            .replace(/^\d+[\).\-\s]*/, '') // remove "1. ", "2 -", etc
            .trim(),
        )
        .filter((t: string) => t.length > 10); // remove lixo

      return tasks.slice(0, 5);
    } catch (error) {
      console.error('Erro IA:', error);

      // fallback MELHORADO (menos genérico)
      return [
        `Definir metas específicas para o projeto "${projectName}"`,
        `Criar plano de execução detalhado para "${projectName}"`,
        `Organizar tarefas principais por prioridade`,
      ];
    }
  }
}
