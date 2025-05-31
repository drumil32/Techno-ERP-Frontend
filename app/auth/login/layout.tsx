// Just added a layout to ensure that overflow is scrollable as on root layout it's hidden
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="overflow-scroll md:overflow-hidden">{children}</div>;
}
