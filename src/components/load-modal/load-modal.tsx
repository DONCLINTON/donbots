// @ts-nocheck — vendored bot code with known upstream type gaps; see AGENTS.md
import React from 'react';
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

    const handleTabItemClick = (active_index: number) => {
        setActiveTabIndex(active_index);
    };

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
                {/* Fixed CSS Isolation Rules for Mobile Viewports */}
                <style>{`
                    .load-strategy__wrapper, 
                    .dc-mobile-full-page-modal, 
                    .dc-mobile-full-page-modal__body,
                    .dc-tabs {
                        background: #15171F !important; /* Fixed solid dark background to isolate workspace bleed */
                        color: var(--text-primary) !important;
                        z-index: 9999 !important; /* Force layout above structural workspace canvas elements */
                    }
                    .google-drive-label, .google-drive__container {
                        background: #15171F !important;
                        position: relative;
                        z-index: 10000 !important;
                    }
                    .dc-tabs__item {
                        color: var(--text-secondary) !important;
                    }
                    .dc-tabs__item--active {
                        color: var(--text-primary) !important;
                        border-bottom-color: var(--color-accent) !important;
                    }
                    /* Ensure all internal elements within Google Drive subcomponents do not draw transparency masks */
                    .load-strategy__wrapper div {
                        background-color: transparent;
                    }
                    .load-strategy__wrapper button, 
                    .load-strategy__wrapper .dc-btn {
                        z-index: 10001 !important; /* Push buttons above layout bounds */
                    }
                `}</style>

                <Tabs active_index={active_index} onTabItemClick={handleTabItemClick} top>
                    <div label={localize('Local')}>
                        <Local />
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
            toggleModal={() => {
                toggleLoadModal();
            }}
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
                    <div label='Google Drive'>
                        <GoogleDrive />
                    </div>
                </Tabs>
            </Modal.Body>
            {has_recent_strategies && (
                <Modal.Footer has_separator>
                    <RecentFooter />
                </Modal.Footer>
            )}
            {is_file_loaded && (
                <Modal.Footer has_separator>
                    <LocalFooter />
                </Modal.Footer>
            )}
        </Modal>
    );
});

export default LoadModal;
