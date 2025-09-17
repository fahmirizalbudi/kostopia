const Grid = ({ className, children }: { className?: string, children: React.ReactNode }) => {
  return <div style={{ display: "grid" }} className={className}>{children}</div>
}

export default Grid
