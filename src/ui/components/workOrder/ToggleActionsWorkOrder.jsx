import { useState } from "react";
import {
    Stack,
    Button,
    Collapse
} from "@mui/material";
import {
    PlayArrow as PlayIcon,
    PauseCircleOutline as PauseIcon,
    CheckCircleOutline as CheckIcon,
    Download as DownloadIcon,
} from "@mui/icons-material";
import ActionWorkOrder from "./ActionWorkOrder";
import useNotification from "../../../../hooks/useNotification";
import workOrderServices from "../../../services/workOrders";
import requestServices from "../../../services/request";

export default function ToogleActionsWorkOrder({
    id, idReq, status, refresh
}) {
    const {
        notification,
        showSuccess,
        showError,
        closeNotification
    } = useNotification();

    const [activePanel, setActivePanel] = useState(null);
    const [hideActions, setHideActions] = useState(false);
    const [loading, setSaving] = useState(false);

    const togglePanel = (type) =>
        setActivePanel((prev) => (prev === type ? null : type));

    const handleConfirm = (type) => (payload) => {
        setActivePanel(null);
        console.log("type:::", type, payload);
        switch (type) {
            case "start": initOrder(); break;
            case "waiting": initWaiting(id, payload); break;
            case "resume": resumeOrder(id); break;
            case "end": closeOrder(id, payload); break;
        }
    };

    const initOrder = async () => {
        try {
            setSaving(true);
            console.log("initorder:::")
            await workOrderServices.initWorkOrder({ _id: id });

            refresh(true);

        } catch (error) {
            console.error(error);
            showError(`Hubo un error al iniciar la orden`);
        } finally {
            setSaving(false);
            setHideActions(false);
        }
    }

    const initWaiting = async (id, params) => {
        try {
            setSaving(true);
            console.log("initWaiting:::")
            await workOrderServices.initWaitingWorkOrder({ _id: id, ...params });

            refresh(true);

        } catch (error) {
            console.error(error);
            showError(`Hubo un error al poner en espera la orden`);
        } finally {
            setSaving(false);
            setHideActions(false);
        }
    }

    const resumeOrder = async (id) => {
        try {
            setSaving(true);
            console.log("resumeOrder:::", id)
            await workOrderServices.resumeWorkOrder({ _id: id });

            refresh(true);

        } catch (error) {
            console.error(error);
            showError(`Hubo un error al reanudar la orden`);
        } finally {
            setSaving(false);
            setHideActions(false);
        }
    }

    const closeOrder = async (id, params) => {
        try {
            setSaving(true);
            console.log("closeOrder:::", id, idReq)
            await workOrderServices.closeWorkOrder({ _id: id, ...params });
            await requestServices.closeReq(idReq, params);

            refresh(true);

        } catch (error) {
            console.error(error);
            showError(`Hubo un error al reanudar la orden`);
        } finally {
            setSaving(false);
            setHideActions(false);
        }
    }

    const Download = async () => {
        try {
            setSaving(true);
            const pdf = await workOrderServices.pdfWorkOrder(id);

            const url = window.URL.createObjectURL(pdf);

            const link = document.createElement("a");
            link.href = url;
            link.download = `Orden-${id}.pdf`;

            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error(error);
            showError(`Hubo un error al descargar la orden`);
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap
                style={{ pb: 1.5 }}>
                {status === "Abierta" && !hideActions &&
                    <>
                        <Button size="small" startIcon={<PlayIcon />}
                            variant="contained"
                            onClick={() => { togglePanel("start"); setHideActions(true); }}
                        >
                            Iniciar
                        </Button>
                        <Button size="small" startIcon={<PauseIcon />}
                            color="secondary"
                            variant="contained"
                            onClick={() => { togglePanel("waiting"); setHideActions(true); }}
                        >
                            En espera
                        </Button>
                    </>
                }
                {status === "En proceso" && !hideActions &&
                    <>
                        <Button size="small" startIcon={<CheckIcon />}
                            variant="contained"
                            onClick={() => { togglePanel("end"); setHideActions(true); }}
                        >
                            Finalizar
                        </Button>
                        <Button size="small" startIcon={<PauseIcon />}
                            variant="contained"
                            color="warning"
                            onClick={() => { togglePanel("waiting"); setHideActions(true); }}
                        >
                            En espera
                        </Button>
                    </>
                }
                {status === "Pendiente" && !hideActions &&
                    <>
                        <Button size="small" startIcon={<PlayIcon />}
                            variant="contained"
                            color="info"
                            onClick={() => { togglePanel("resume"); setHideActions(true); }}
                        >
                            Reanudar
                        </Button>
                    </>
                }
                {status === "Cerrada" &&
                    <>
                        <Button size="small" startIcon={<DownloadIcon />}
                            disabled={loading}
                            variant="outlined"
                            color="secondary"
                            onClick={() => Download()}
                        >
                            Descargar
                        </Button>
                    </>
                }
            </Stack>

            {/* ── Panel de acción ── */}
            <Collapse in={!!activePanel} unmountOnExit>
                {activePanel && (
                    <ActionWorkOrder
                        type={activePanel}
                        onConfirm={handleConfirm(activePanel)}
                        onCancel={() => { setActivePanel(null); setHideActions(false); }}
                        otId={id}
                    />
                )}
            </Collapse>
        </>
    );
}