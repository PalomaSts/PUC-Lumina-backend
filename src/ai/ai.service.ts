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
                        inputs: `Liste 5 tarefas para um projeto chamado: ${projectName}`,
                    }),
                },
            );

            const data: any = await response.json();

            const text = data?.[0]?.generated_text || '';

            return text
                .split('\n')
                .map((t: string) => t.trim())
                .filter((t: string) => t.length > 0)
                .slice(0, 5);
        } catch (error) {
            console.error('Erro IA:', error);

            // fallback (importante!)
            return [
                `Definir objetivos do projeto "${projectName}"`,
                'Criar planejamento inicial',
                'Dividir tarefas principais',
            ];
        }
    }
}