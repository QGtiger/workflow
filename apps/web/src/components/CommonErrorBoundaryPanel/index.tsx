export default function CommonErrorBoundaryPanel(props: any) {
  return (
    <div className=" whitespace-break-spaces">
      CommonErrorBoundaryPanel:
      <br />
      {props.error.stack}
    </div>
  );
}
