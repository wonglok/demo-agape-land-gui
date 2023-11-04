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
        </ul>
      </div>
    </>
  )
}
