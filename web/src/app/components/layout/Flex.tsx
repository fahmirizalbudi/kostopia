const Flex = ({ className, children, gap }: { className?: string, children: React.ReactNode, gap?: number }) => {
  return <div style={{ display: "flex", gap: gap }} className={className}>{children}</div>
}

export default Flex
