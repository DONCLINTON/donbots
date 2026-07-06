// @ts-nocheck — vendored bot code with known upstream type gaps; see AGENTS.md
import { TSidebarItem } from './constants';

type TIntroCard = {
    sidebar_item: TSidebarItem;
};

const Index = ({ sidebar_item }: TIntroCard) => {
    const { label, content } = sidebar_item;
    return (
        <div className='premium-glass-card' key={label} style={{ padding: '24px', marginBottom: '16px' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                {label}
            </h1>
            {content?.map(text => (
                <p key={`sidebar-tour${text}`} style={{ fontSize: '0.875rem', lineHeight: '1.5', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    {text}
                </p>
            ))}
        </div>
    );
};

export default Index;
