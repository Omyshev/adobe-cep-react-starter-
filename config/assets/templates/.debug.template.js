module.exports = (props) =>
    `<?xml version="1.0" encoding="UTF-8"?>
<ExtensionList>
  <Extension Id="${props.extensionBundleId}">
  <HostList>
    <Host Name="PHXS" Port="3001" />
    <Host Name="PHSP" Port="3002" />
    <Host Name="IDSN" Port="3003" />
    <Host Name="AICY" Port="3004" />
    <Host Name="ILST" Port="3005" />
    <Host Name="PPRO" Port="3006" />
    <Host Name="AEFT" Port="3007" />
    <Host Name="PRLD" Port="3008" />
    <Host Name="FLPR" Port="3009" />
    <Host Name="DRWV" Port="3010" />
  </HostList>
  </Extension>
</ExtensionList>`
