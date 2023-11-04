export default function Page() {
  return (
    <>
      <div className='p-2'>
        <div className='mb-4 text-2xl'>AGAPE Demos</div>
        <ul className=''>
          <a href={`/garage`} target='_blank'>
            <li className='mb-2 list-item list-inside list-decimal'>Garage</li>
          </a>
          <a href={`/querlo`} target='_blank'>
            <li className='mb-2 list-item list-inside list-decimal'>Querlo</li>
          </a>
          <a href={`/vending-machine`} target='_blank'>
            <li className='mb-2 list-item list-inside list-decimal'>Vending Machine</li>
          </a>
          <a href={`https://gameofphonesvr.com`} target='_blank'>
            <li className='mb-2 list-item list-inside list-decimal'>T Mobile</li>
          </a>
          <a href={`https://tool.agape.land`} target='_blank'>
            <li className='mb-2 list-item list-inside list-decimal'>Artist Tool</li>
          </a>
        </ul>
      </div>
    </>
  )
}
