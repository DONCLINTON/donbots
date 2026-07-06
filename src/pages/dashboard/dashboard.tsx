// @ts-nocheck — vendored bot code with known upstream type gaps; see AGENTS.md
import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import Text from '@/components/shared_ui/text';
import { useStore } from '@/hooks/useStore';
import { localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import OnboardTourHandler from '../tutorials/dbot-tours/onboarding-tour';
import Announcements from './announcements';
import Cards from './cards';
import InfoPanel from './info-panel';

type TMobileIconGuide = {
    handleTabChange: (active_number: number) => void;
};

const DashboardComponent = observer(({ handleTabChange }: TMobileIconGuide) => {
    const { load_modal, dashboard, client, google_drive, transactions, run_panel } = useStore();
    const { dashboard_strategies } = load_modal;
    const { is_google_drive_configured } = google_drive;
    const { active_tab, active_tour } = dashboard;
    const has_dashboard_strategies = !!dashboard_strategies?.length;
    const { isDesktop, isTablet } = useDevice();

    // Pull real-time bot statistics from the global execution stream
    const { statistics } = transactions;
    const { is_running } = run_panel;
    const { total_profit, won_contracts, number_of_runs } = statistics;

    // Dynamically calculate the active win rate percentage
    const win_rate = number_of_runs > 0 ? ((won_contracts / number_of_runs) * 100).toFixed(1) : '0.0';

    return (
        <React.Fragment>
            {/* Main Wrapper forced into a column block layout to prevent side-by-side squeezing */}
            <div 
                style={{ 
                    display: 'block', 
                    width: '100%', 
                    backgroundColor: 'var(--bg-main)', 
                    padding: isDesktop ? '24px' : '12px',
                    boxSizing: 'border-box'
                }}
            >
                {/* HORIZONTAL FINTECH LIVE METRICS BANNER */}
                <div 
                    className='premium-glass-card' 
                    style={{ 
                        display: 'flex', 
                        flexDirection: 'row', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '8px', 
                        padding: '12px 16px', 
                        marginBottom: '16px',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, alignItems: 'center' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.02em', textAlign: 'center' }}>
                            Net Profit
                        </span>
                        <span style={{ 
                            fontSize: '1rem', 
                            fontWeight: '700', 
                            color: total_profit > 0 ? '#4ade80' : total_profit < 0 ? '#f87171' : 'var(--text-primary)', 
                            letterSpacing: '-0.01em' 
                        }}>
                            {total_profit >= 0 ? `+$${total_profit.toFixed(2)}` : `$${total_profit.toFixed(2)}`}
                        </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, alignItems: 'center', borderLeft: '1px solid rgba(0,0,0,0.08)', borderRight: '1px solid rgba(0,0,0,0.08)' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.02em', textAlign: 'center' }}>
                            Win Rate
                        </span>
                        <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                            {win_rate}%
                        </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, alignItems: 'center' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.02em', textAlign: 'center' }}>
                            Status
                        </span>
                        <span style={{ 
                            fontSize: '0.9rem', 
                            fontWeight: '700', 
                            color: is_running ? '#4ade80' : 'var(--text-muted)', 
                            letterSpacing: '-0.01em' 
                        }}>
                            {is_running ? 'Live' : 'Ready'}
                        </span>
                    </div>
                </div>

                <div
                    className={classNames('tab__dashboard', {
                        'tab__dashboard--tour-active': active_tour,
                    })}
                    style={{ width: '100%' }}
                >
                    <div className='tab__dashboard__content' style={{ width: '100%', maxWidth: '100%' }}>
                        {client.is_logged_in && (
                            <Announcements is_mobile={!isDesktop} is_tablet={isTablet} handleTabChange={handleTabChange} />
                        )}
                        <div className='quick-panel' style={{ width: '100%' }}>
                            <div
                                className={classNames('tab__dashboard__header', {
                                    'tab__dashboard__header--listed': isDesktop && has_dashboard_strategies,
                                })}
                                style={{ marginBottom: '16px' }}
                            >
                                {!has_dashboard_strategies && (
                                    <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-0.01em' }}>
                                        {localize('Load or build your bot')}
                                    </h2>
                                )}
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                                    {is_google_drive_configured
                                        ? localize(
                                              'Import a bot from your computer or Google Drive, build it from scratch, or start with a quick strategy.'
                                          )
                                        : localize(
                                              'Import a bot from your computer, build it from scratch, or start with a quick strategy.'
                                          )}
                                </p>
                            </div>
                            <Cards has_dashboard_strategies={has_dashboard_strategies} is_mobile={!isDesktop} />
                        </div>
                    </div>
                </div>
            </div>
            <InfoPanel />
            {active_tab === 0 && <OnboardTourHandler is_mobile={!isDesktop} />}
        </React.Fragment>
    );
});

export default DashboardComponent;
