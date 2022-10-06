export interface TokenInputProps {
  assetIdInputProps: object
  assetAmountInputProps: object
  disabled?: boolean
}

export const TokenInput = ({
  assetIdInputProps,
  assetAmountInputProps,
  disabled
}: TokenInputProps) => {
  return (
    <div>
      <div>
        <b>AssetId:</b> <br />
        <input disabled={disabled} type="text" {...assetIdInputProps} />
      </div>
      <div>
        <b>Asset amount:</b> <br />
        <input disabled={disabled} type="text" {...assetAmountInputProps} />
      </div>
    </div>
  )
}
