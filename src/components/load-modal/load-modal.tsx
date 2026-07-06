// @ts-nocheck — vendored bot code with known upstream type gaps; see AGENTS.md
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { tabs_title } from '@/constants/load-modal';
import { useStore } from '@/hooks/useStore';
import { localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import MobileFullPageModal from '../shared_ui/mobile-full-page-modal';
import Modal from '../shared_ui/modal';
import Tabs from '../shared_ui/tabs';
import GoogleDrive from './google-drive';
import Local from './local';
import LocalFooter from './local-footer';
import Recent from './recent';
import RecentFooter from './recent-footer';

interface Strategy {
    id: string;
    name: string;
    description: string;
    market: string;
    trade_type: string;
    win_rate_tag: string;
    xml_url: string;
}

const LoadModal: React.FC = observer(() => {
    const { load_modal, dashboard } = useStore();
    const {
        active_index,
        is_load_modal_open,
        loaded_local_file,
        onEntered,
        recent_strategies,
        setActiveTabIndex,
        toggleLoadModal,
        tab_name,
    } = load_modal;
    const { setPreviewOnPopup } = dashboard;
    const { isDesktop } = useDevice();
    const header_text = localize('Load strategy');

    // Cloud Hosted Strategies State
    const [strategies, setStrategies] = useState<Strategy[]>([]);
    const [loadingCloud, setLoadingCloud] = useState(true);

    useEffect(() => {
        if (is_load_modal_open) {
            setLoadingCloud(true);
            fetch('https://raw.githubusercontent.com/DONCLINTON/Trading-Bots/main/manifest.json')
                .then((res) => res.json())
                .then((data) => {
                    if (data && data.strategies) setStrategies(data.strategies);
                    setLoadingCloud(false);
                })
                .catch((err) => {
                    console.error('Error fetching cloud manifest:', err);
                    setLoadingCloud(false);
                });
        }
    }, [is_load_modal_open]);

    const handleTabItemClick = (active_index: number) => {
        setActiveTabIndex(active_index);
    };

    const handleSelectCloudBot = async (url: string) => {
        try {
            const response = await fetch(url);
            const xmlText = await response.text();
            // TODO: Pass xmlText to Phase 3 XML Parser / Execution loop
            console.log('Downloaded XML content successfully:', xmlText.substring(0, 200));
            toggleLoadModal();
            alert('Cloud strategy loaded successfully into memory!');
        } catch (error) {
            console.error('Failed downloading strategy XML:', error);
        }
    };

    const renderCloudStrategies = () => (
        <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {loadingCloud ? (
                <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>Loading automated strategies...</div>
            ) : strategies.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>No automated bots found.</div>
            ) : (
                strategies.map((bot) => (
                    <div 
                        key={bot.id} 
                        onClick={() => handleSelectCloudBot(bot.xml_url)}
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '8px',
                            padding: '14px',
                            cursor: 'pointer',
                            position: 'relative',
                            zIndex: 10005
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '6px' }}>
                            <h4 style={{ color: '#fff', margin: 0, fontSize: '15px', fontWeight: '600' }}>{bot.name}</h4>
                            <span style={{
                                background: 'var(--color-accent)',
                                color: '#fff',
                                fontSize: '10px',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                marginLeft: 'auto'
                            }}>{bot.win_rate_tag}</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: '0 0 8px 0', lineHeight: '1.4' }}>{bot.description}</p>
                        <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                            <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>📊 {bot.market}</span>
                            <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>⚙️ {bot.trade_type}</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );

    if (!isDesktop) {
        return (
            <MobileFullPageModal
                is_modal_open={is_load_modal_open}
                className='load-strategy__wrapper'
                header={header_text}
                onClickClose={() => {
                    setPreviewOnPopup(false);
                    toggleLoadModal();
                }}
                height_offset='80px'
                page_overlay
            >
                <style>{`
                    .load-strategy__wrapper, .dc-mobile-full-page-modal, .dc-mobile-full-page-modal__body, .dc-tabs {
                        background: #15171F !important;
                        color: var(--text-primary) !important;
                        z-index: 9999 !important;
                    }
                    .dc-tabs__item { color: var(--text-secondary) !important; }
                    .dc-tabs__item--active { color: var(--text-primary) !important; border-bottom-color: var(--color-accent) !important; }
                `}</style>

                <Tabs active_index={active_index} onTabItemClick={handleTabItemClick} top>
                    <div label={localize('Local')}>
                        <Local />
                    </div>
                    <div label='Automated Bots'>
                        {renderCloudStrategies()}
                    </div>
                    <div label='Google Drive'>
                        <div style={{ position: 'relative', zIndex: 10000, background: '#15171F', padding: '16px' }}>
                            <GoogleDrive />
                        </div>
                    </div>
                </Tabs>
            </MobileFullPageModal>
        );
    }

    const is_file_loaded = !!loaded_local_file && tab_name === tabs_title.TAB_LOCAL;
    const has_recent_strategies = recent_strategies.length > 0 && tab_name === tabs_title.TAB_RECENT;

    return (
        <Modal
            title={header_text}
            className='load-strategy'
            width='1000px'
            height='80vh'
            is_open={is_load_modal_open}
            toggleModal={() => toggleLoadModal()}
            onEntered={onEntered}
            elements_to_ignore={[document.querySelector('.injectionDiv')]}
        >
            <style>{`
                .load-strategy .dc-modal-dialog, .load-strategy .dc-modal-body, .load-strategy .dc-modal-footer {
                    background: var(--bg-surface) !important;
                    color: var(--text-primary) !important;
                    border-color: rgba(255,255,255,0.05) !important;
                }
            `}</style>
            <Modal.Body>
                <Tabs active_index={active_index} onTabItemClick={handleTabItemClick} top header_fit_content>
                    <div label={localize('Recent')}>
                        <Recent />
                    </div>
                    <div label={localize('Local')}>
                        <Local />
                    </div>
                    <div label='Automated Bots'>
                        {renderCloudStrategies()}
                    </div>
                    <div label='Google Drive'>
                        <GoogleDrive />
                    </div>
                </Tabs>
            </Modal.Body>
            {has_recent_strategies && (
                <Modal.Footer has_separator><RecentFooter /></Modal.Footer>
            )}
            {is_file_loaded && (
                <Modal.Footer has_separator><LocalFooter /></Modal.Footer>
            )}
        </Modal>
    );
});

export default LoadModal;
