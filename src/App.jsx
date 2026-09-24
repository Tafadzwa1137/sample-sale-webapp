import { useState } from 'react'

const blankItem = () => ({ itemType: '', colour: '', description: '', priority: 'Must have' })

const initialPlan = {
  saleName: '',
  saleDate: '',
  location: '',
  items: [blankItem()],
}

function App() {
  const [plan, setPlan] = useState(initialPlan)
  const [saved, setSaved] = useState(false)

  function updatePlan(field, value) {
    setPlan((current) => ({ ...current, [field]: value }))
    setSaved(false)
  }

  function updateItem(index, field, value) {
    setPlan((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }))
    setSaved(false)
  }

  function addItem() {
    setPlan((current) => ({ ...current, items: [...current.items, blankItem()] }))
  }

  function removeItem(index) {
    setPlan((current) => ({
      ...current,
      items: current.items.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  function savePlan(event) {
    event.preventDefault()
    const planToSave = { ...plan, id: crypto.randomUUID(), savedAt: new Date().toISOString() }
    const existingPlans = JSON.parse(localStorage.getItem('sample-sale-plans') || '[]')
    localStorage.setItem('sample-sale-plans', JSON.stringify([...existingPlans, planToSave]))
    setSaved(true)
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">sample<span>sale</span></a>
        <span className="status-dot">planner</span>
      </header>

      <section className="intro">
        <p className="eyebrow">Your next treasure hunt</p>
        <h1>Make a plan.<br /><em>Find the good stuff.</em></h1>
        <p className="intro-copy">Tell us what you are hoping to find and we will help you shop the sale with intention.</p>
      </section>

      <form className="planner-form" onSubmit={savePlan}>
        <section className="form-section sale-details">
          <div className="section-heading">
            <span className="section-number">01</span>
            <div>
              <h2>Which sale?</h2>
              <p>Start with the details you know.</p>
            </div>
          </div>
          <div className="field-grid">
            <label>Brand or sale name<input required value={plan.saleName} onChange={(event) => updatePlan('saleName', event.target.value)} placeholder="e.g. Acne Studios archive" /></label>
            <label>When is it?<input type="date" value={plan.saleDate} onChange={(event) => updatePlan('saleDate', event.target.value)} /></label>
            <label className="wide-field">Where is it?<input value={plan.location} onChange={(event) => updatePlan('location', event.target.value)} placeholder="e.g. 12 Great Pulteney Street, London" /></label>
          </div>
        </section>

        <section className="form-section preferences">
          <div className="section-heading">
            <span className="section-number">02</span>
            <div>
              <h2>What are you looking for?</h2>
              <p>Add as many preferences as you like. We will use these to rank your hunt.</p>
            </div>
          </div>
          <div className="item-list">
            {plan.items.map((item, index) => (
              <div className="item-row" key={index}>
                <span className="item-index">{String(index + 1).padStart(2, '0')}</span>
                <label>Item type<input required value={item.itemType} onChange={(event) => updateItem(index, 'itemType', event.target.value)} placeholder="e.g. wool coat" /></label>
                <label>Colour<input value={item.colour} onChange={(event) => updateItem(index, 'colour', event.target.value)} placeholder="e.g. black" /></label>
                <label>Priority<select value={item.priority} onChange={(event) => updateItem(index, 'priority', event.target.value)}><option>Must have</option><option>Would love</option><option>Nice to have</option></select></label>
                <label className="description-field">Notes<input value={item.description} onChange={(event) => updateItem(index, 'description', event.target.value)} placeholder="Fit, fabric, or details" /></label>
                {plan.items.length > 1 && <button className="remove-button" type="button" aria-label={`Remove item ${index + 1}`} onClick={() => removeItem(index)}>×</button>}
              </div>
            ))}
          </div>
          <button className="add-button" type="button" onClick={addItem}>+ Add another item</button>
        </section>

        <div className="form-footer">
          <p className={saved ? 'save-message visible' : 'save-message'}>{saved ? 'Plan saved on this device.' : 'Your plan stays private until you save it.'}</p>
          <button className="save-button" type="submit">Save my plan <span>↗</span></button>
        </div>
      </form>
    </main>
  )
}

export default App