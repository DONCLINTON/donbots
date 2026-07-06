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
    const { load_modal, dashboard, client, google_drive } = useStore();
    const { dashboard_strategies } = load_modal;
    const { is_google_drive_configured } = google_drive;
    const { active_tab, active_tour } = dashboard;
    const has_dashboard_strategies = !!dashboard_strategies?.length;
    const { isDesktop, isTablet } = useDevice();

    return (
        <React.Fragment>
            <div
                className={classNames('tab__dashboard', {
                    'tab__dashboard--tour-active': active_tour,
                })}
                style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: isDesktop ? '24px' : '12px' }}
            >
                {/* PREMIUM FINTECH LIVE METRICS BANNER */}
                <div 
                    className='premium-glass-card' 
                    style={{ 
                        display: 'grid', 
                        gridTemplateColumns: isDesktop ? 'repeat(3, 1fr)' : '1fr', 
                        gap: '16px', 
                        padding: '20px', 
                        marginBottom: '24px' 
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Net Profit PnL
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className='pulse-dot running'></span>
                            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-running)', letterSpacing: '-0.03em' }}>
                                +$0.00
                            </span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderLeft: isDesktop ? '1px solid rgba(255,255,255,0.08)' : 'none', paddingLeft: isDesktop ? '24px' : '0' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Win Rate
                        </span>
                        <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                            0.0%
                        </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderLeft: isDesktop ? '1px solid rgba(255,255,255,0.08)' : 'none', paddingLeft: isDesktop ? '24px' : '0' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Active Balance
                        </span>
                        <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-accent)', letterSpacing: '-0.03em' }}>
                            {client.is_logged_in ? 'Connected' : 'Offline'}
                        </span>
                    </div>
                </div>

                <div className='tab__dashboard__content'>
                    {client.is_logged_in && (
                        <Announcements is_mobile={!isDesktop} is_tablet={isTablet} handleTabChange={handleTabChange} />
                    )}
                    <div className='quick-panel'>
                        <div
                            className={classNames('tab__dashboard__header', {
                                'tab__dashboard__header--listed': isDesktop && has_dashboard_strategies,
                            })}
                            style={{ marginBottom: '16px' }}
                        >
                            {!has_dashboard_strategies && (
                                <h2 style={{ fontSize: isDesktop ? '1.5rem' : '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                                    {localize('Load or build your bot')}
                               </h2>
                            )}
                            <p style={{ fontSize: isDesktop ? '0.9rem' : '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
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
            <InfoPanel />
            {active_tab === 0 && <OnboardTourHandler is_mobile={!isDesktop} />}
        </React.Fragment>
    );
});

export default DashboardComponent;
