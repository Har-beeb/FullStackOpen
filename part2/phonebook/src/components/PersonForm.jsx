const PersonForm = ({valueName, onChangeName, valueNum, onChangeNum, onSubmit, text}) => {

  return (
    <>
      <form onSubmit={onSubmit}>
        <div>
          name: <input value={valueName} onChange={onChangeName} />
        </div>
        <div>
          number: <input value={valueNum} onChange={onChangeNum} />
        </div>
        <div>
          <button type="submit">{text}</button>
        </div>
      </form>
    </>
  )
}

export default PersonForm