import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import Modal from '@/components/shared_ui/modal';
import Text from '@/components/shared_ui/text';
import { DBOT_TABS } from '@/constants/bot-contents';
import { useStore } from '@/hooks/useStore';
import { LegacyClose1pxIcon } from '@deriv/quill-icons/Legacy';
import { useDevice } from '@deriv-com/ui';
import { SIDEBAR_INTRO } from './constants';

const InfoPanel = observer(() => {
    const { isDesktop } = useDevice();
    const { dashboard } = useStore();

    const [is_tour_open, setIsTourOpen] = React.useState(false);

    const {
        active_tour,
        is_info_panel_visible,
        setActiveTab,
        setActiveTabTutorial,
        setInfoPanelVisibility,
        setFaqTitle,
    } = dashboard;
    const switchTab = (link: boolean, label: string, faq_id: string) => {
        const tutorial_link = link ? setActiveTab(DBOT_TABS.TUTORIAL) : null;
        const tutorial_label = label === 'Guide' ? setActiveTabTutorial(0) : setActiveTabTutorial(1);
        setFaqTitle(faq_id);
        return {
            tutorial_link,
            tutorial_label,
        };
    };

    const handleClose = () => {
        setInfoPanelVisibility(false);
        setIsTourOpen(false);
        localStorage.setItem('dbot_should_show_info', JSON.stringify(Date.now()));
    };

    React.useEffect(() => {
        if (is_info_panel_visible) {
            setIsTourOpen(true);
        } else {
            setIsTourOpen(false);
        }
    }, [is_info_panel_visible]);

    const renderInfo = () => (
        <div 
            className='db-info-panel' 
            style={{ 
                backgroundColor: 'var(--bg-main)', 
                color: 'var(--text-primary)',
                padding: '20px',
                minHeight: '200px'
            }}
        >
            <div 
                data-testid='close-icon' 
                className='db-info-panel__close-action' 
                onClick={handleClose}
                style={{ position: 'absolute', right: '16px', top: '16px', zIndex: 10, filter: 'invert(1)' }}
            >
                <LegacyClose1pxIcon height='18px' width='18px' fill='var(--text-primary)' />
            </div>

            {SIDEBAR_INTRO().map(sidebar_item => {
                const { label, content, link } = sidebar_item;
                return (
                    <div key={`${label}-${content}`} style={{ marginBottom: '20px' }}>
                        <h1 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '-0.01em' }}>
                            {label}
                        </h1>
                        {content.map(text => (
                            <div
                                key={`info-panel-tour${text.data}`}
                                className={classNames('db-info-panel__card premium-glass-card', {
                                    'db-info-panel__content': link,
                                })}
                                onClick={() => switchTab(link, label, text.faq_id)}
                                style={{ 
                                    padding: '14px', 
                                    marginBottom: '8px', 
                                    cursor: 'pointer',
                                    borderRadius: '8px'
                                }}
                            >
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>
                                    {text.data}
                                </p>
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );

    return isDesktop ? (
        !active_tour && (
            <div
                className={classNames('tab__dashboard__info-panel', {
                    'tab__dashboard__info-panel--active': is_info_panel_visible,
                })}
            >
                {renderInfo()}
            </div>
        )
    ) : (
        <Modal
            className='statistics__modal statistics__modal--mobile'
            is_open={is_tour_open}
            toggleModal={handleClose}
            width={'440px'}
        >
            {/* Inject global styling overrides for modal wrapper on mobile inside the document */}
            <style>{`
                .statistics__modal--mobile .dc-modal-dialog {
                    background: var(--bg-main) !important;
                }
                .statistics__modal--mobile .dc-modal-body {
                    background: var(--bg-main) !important;
                    padding: 0 !important;
                }
                .dc-tabs__item--active {
                    border-bottom-color: var(--color-accent) !important;
                }
            `}</style>
            <Modal.Body>{renderInfo()}</Modal.Body>
        </Modal>
    );
});

export default InfoPanel;
