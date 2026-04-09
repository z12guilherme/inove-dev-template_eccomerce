import { render, screen } from '@testing-library/react';
import Title from './Title';

describe('Componente Title', () => {
    it('deve renderizar o título e a descrição corretamente', () => {
        render(<Title title="Meu Título" description="Minha Descrição" />);
        
        expect(screen.getByText('Meu Título')).toBeInTheDocument();
        expect(screen.getByText('Minha Descrição')).toBeInTheDocument();
    });

    it('deve renderizar o botão quando visibleButton for true (padrão)', () => {
        render(<Title title="Teste" description="Teste" />);
        
        // Usando regex para ignorar case e espaços
        expect(screen.getByText(/Ver mais/i)).toBeInTheDocument();
    });

    it('não deve renderizar o botão quando visibleButton for false', () => {
        render(<Title title="Teste" description="Teste" visibleButton={false} />);
        
        expect(screen.queryByText(/Ver mais/i)).not.toBeInTheDocument();
    });
});