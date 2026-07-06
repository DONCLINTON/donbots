import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import {
    LabelPairedArrowRotateLeftMdRegularIcon,
    LabelPairedArrowRotateRightMdRegularIcon,
    LabelPairedArrowsRotateMdRegularIcon,
    LabelPairedChartLineMdRegularIcon,
    LabelPairedChartTradingviewMdRegularIcon,
    LabelPairedFolderOpenMdRegularIcon,
    LabelPairedMagnifyingGlassMinusMdRegularIcon,
    LabelPairedMagnifyingGlassPlusMdRegularIcon,
    LabelPairedObjectsAlignLeftMdRegularIcon,
} from '@deriv/quill-icons/LabelPaired';
import { localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
/* [AI] - Analytics event tracking removed - see migrate-docs/MONITORING_PACKAGES.md for re-implementation guide */
/* [/AI] */
import ToolbarIcon from './toolbar-icon';

const WorkspaceGroup = observer(() => {
    const { dashboard, toolbar, load_modal } = useStore();
    const { setPreviewOnPopup, setChartModalVisibility, setTradingViewModalVisibility } = dashboard;
    const { has_redo_stack, has_undo_stack, onResetClick, onSortClick, onUndoClick, onZoomInOutClick } = toolbar;
    const { toggleLoadModal } = load_modal;
    const { isDesktop } = useDevice();

    return (
        <div className='toolbar__wrapper'>
            <div className='toolbar__group toolbar__group-btn' data-testid='dt_toolbar_group_btn'>
                <ToolbarIcon
                    popover_message={localize('Reset')}
                    icon={
                        <span
                            id='db-toolbar__reset-button'
                            className='toolbar__icon'
                            onClick={onResetClick}
                            data-testid='dt_toolbar_reset_button'
                        >
                            <LabelPairedArrowsRotateMdRegularIcon />
                        </span>
                    }
                />
                <ToolbarIcon
                    popover_message={localize('Import')}
                    icon={
                        <span
                            className='toolbar__icon'
                            id='db-toolbar__import-button'
                            data-testid='dt_toolbar_import_button'
                            onClick={() => {
                                setPreviewOnPopup(true);
                                toggleLoadModal();
                                /* [AI] - Analytics event tracking removed - see migrate-docs/MONITORING_PACKAGES.md for re-implementation guide */
                                /* [/AI] */
                            }}
                        >
                            <LabelPairedFolderOpenMdRegularIcon />
                        </span>
                    }
                />
                
                {/* 
                  [CUSTOM UPGRADE] Added direct WhatsApp entry point 
                  to connect with followers instead of letting them download the XML 
                */}
                <ToolbarIcon
                    popover_message={localize('Contact Developer')}
                    icon={
                        <a
                            href="https://wa.me/256757815846"
                            target="_blank"
                            rel="noopener noreferrer"
                            className='toolbar__icon'
                            id='db-toolbar__whatsapp-button'
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                        >
                            {/* Using a clean, inline generic chat bubble SVG that fits the toolbar design perfectly */}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2 22l5.161-1.312A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm1 .35c4.683.473 8.327 4.117 8.8 8.8-.52 4.542-4.117 8.14-8.66 8.65a8.7 8.7 0 01-4.04-.79l-.3-.18-3 1 .76-2.91-.2-.31A8.7 8.7 0 0113 2.35z" fill="currentColor"/>
                            </svg>
                        </a>
                    }
                />

                <ToolbarIcon
                    popover_message={localize('Sort blocks')}
                    icon={
                        <span
                            className='toolbar__icon'
                            id='db-toolbar__sort-button'
                            data-testid='dt_toolbar_sort_button'
                            onClick={onSortClick}
                        >
                            <LabelPairedObjectsAlignLeftMdRegularIcon />
                        </span>
                    }
                />
                {isDesktop && (
                    <>
                        <div className='vertical-divider' />
                        <ToolbarIcon
                            popover_message={localize('Charts')}
                            icon={
                                <span
                                    className='toolbar__icon'
                                    id='db-toolbar__charts-button'
                                    onClick={() => setChartModalVisibility()}
                                >
                                    <LabelPairedChartLineMdRegularIcon />
                                </span>
                            }
                        />
                        <ToolbarIcon
                            popover_message={localize('TradingView Chart')}
                            icon={
                                <span
                                    className='toolbar__icon'
                                    id='db-toolbar__tradingview-button'
                                    onClick={() => setTradingViewModalVisibility()}
                                >
                                    <LabelPairedChartTradingviewMdRegularIcon />
                                </span>
                            }
                        />
                    </>
                )}
                <div className='vertical-divider' />
                <ToolbarIcon
                    popover_message={localize('Undo')}
                    icon={
                        <span
                            className={classNames('toolbar__icon undo', {
                                'toolbar__icon--disabled': !has_undo_stack,
                            })}
                            id='db-toolbar__undo-button'
                            data-testid='dt_toolbar_undo_button'
                            onClick={() => onUndoClick(/* redo */ false)}
                        >
                            <LabelPairedArrowRotateLeftMdRegularIcon />
                        </span>
                    }
                />
                <ToolbarIcon
                    popover_message={localize('Redo')}
                    icon={
                        <span
                            className={classNames('toolbar__icon redo', {
                                'toolbar__icon--disabled': !has_redo_stack,
                            })}
                            id='db-toolbar__redo-button'
                            data-testid='dt_toolbar_redo_button'
                            onClick={() => onUndoClick(/* redo */ true)}
                        >
                            <LabelPairedArrowRotateRightMdRegularIcon />
                        </span>
                    }
                />
                <div className='vertical-divider' />
                <ToolbarIcon
                    popover_message={localize('Zoom in')}
                    icon={
                        <span
                            className='toolbar__icon'
                            id='db-toolbar__zoom-in-button'
                            data-testid='dt_toolbar_zoom_in_button'
                            onClick={() => onZoomInOutClick(/* in */ true)}
                        >
                            <LabelPairedMagnifyingGlassPlusMdRegularIcon />
                        </span>
                    }
                />
                <ToolbarIcon
                    popover_message={localize('Zoom out')}
                    icon={
                        <span
                            className='toolbar__icon'
                            id='db-toolbar__zoom-out'
                            data-testid='dt_toolbar_zoom_out_button'
                            onClick={() => onZoomInOutClick(/* in */ false)}
                        >
                            <LabelPairedMagnifyingGlassMinusMdRegularIcon />
                        </span>
                    }
                />
            </div>
        </div>
    );
});

export default WorkspaceGroup;
