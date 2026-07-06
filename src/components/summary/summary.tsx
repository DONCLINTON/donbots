import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { useDevice } from '@deriv-com/ui';
import ThemedScrollbars from '../shared_ui/themed-scrollbars';
import SummaryCard from './summary-card';

type TSummary = {
    is_drawer_open: boolean;
};

const Summary = observer(({ is_drawer_open }: TSummary) => {
    const { dashboard, summary_card, transactions, run_panel } = useStore();
    const { is_contract_loading, contract_info } = summary_card;
    const { active_tour } = dashboard;
    const { isDesktop } = useDevice();
    
    // Pull active live statistics from the transactions and run stores
    const { statistics } = transactions;
    const { is_running } = run_panel;
    const { total_profit, won_contracts, number_of_runs } = statistics;

    // Calculate live win rate percentage safely
    const win_rate = number_of_runs > 0 ? ((won_contracts / number_of_runs) * 180).toFixed(1) : '0.0';

    return (
        <div
            className={classnames({
                'run-panel-tab__content': isDesktop,
                'run-panel-tab__content--mobile': !isDesktop && is_drawer_open,
                'run-panel-tab__content--summary-tab': (isDesktop && is_drawer_open) || active_tour,
            })}
            data-testid='mock-summary'
        >
            {/* LIVE DATA HEADER ROW */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                padding: '12px 6px',
                background: 'var(--background-section)',
                borderBottom: '1px solid var(--border-normal)',
                textAlign: 'center',
                gap: '4px'
            }}>
                <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Net Profit</div>
                    <div style={{ 
                        fontSize: '14px', 
                        fontWeight: 'bold', 
                        color: total_profit > 0 ? '#4ade80' : total_profit < 0 ? '#f87171' : 'var(--text-general)' 
                    }}>
                        {total_profit >= 0 ? `+$${total_profit.toFixed(2)}` : `$${total_profit.toFixed(2)}`}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Win Rate</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-general)' }}>{win_rate}%</div>
                </div>
                <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</div>
                    <div style={{ 
                        fontSize: '14px', 
                        fontWeight: 'bold', 
                        color: is_running ? '#4ade80' : 'var(--text-muted)' 
                    }}>
                        {is_running ? 'Live' : 'Idle'}
                    </div>
                </div>
            </div>

            <ThemedScrollbars
                className={classnames({
                    summary: (!is_contract_loading && !contract_info) || is_running,
                    'summary--loading':
                        (!isDesktop && is_contract_loading) || (!isDesktop && !is_contract_loading && contract_info),
                })}
            >
                <SummaryCard
                    is_contract_loading={is_contract_loading}
                    contract_info={contract_info}
                    is_bot_running={is_running}
                />
            </ThemedScrollbars>
        </div>
    );
});

export default Summary;
