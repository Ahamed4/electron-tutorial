import electron from "electron";

electron.contextBridge.exposeInMainWorld("electron", {
  subscribeStatistics: (callback) =>
    ipcOn("statistics", (stats) => {
      callback(stats);
    }),
  getStaticData: () => ipcInvoke("getStaticData"),
  subscribeChangeView: (callback) =>
    ipcOn("changeView", (stat) => {
      callback(stat);
    }),
  sendFrameAction: (payload) => ipcSend("sendFrameAction", payload),
} satisfies Window["electron"]);

function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void
) {
  const cb = (_: electron.IpcRendererEvent, payload: any) => callback(payload);
  electron.ipcRenderer.on(key, cb);
  return () => electron.ipcRenderer.off(key, cb);
}

function ipcInvoke<Key extends keyof EventPayloadMapping>(
  key: Key
): Promise<EventPayloadMapping[Key]> {
  return electron.ipcRenderer.invoke(key);
}

function ipcSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  payload: EventPayloadMapping[Key]
) {
  electron.ipcRenderer.send(key, payload);
}
