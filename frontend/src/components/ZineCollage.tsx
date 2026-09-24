import background from '../assets/background.jpg'

export function ZineCollage() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      <img src={background} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/45" />
    </div>
  )
}
