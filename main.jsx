import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState } from 'react';

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    diagnostico: '',
    queixas: [],
    inicioSintomas: '',
    tratamentosAnteriores: '',
    medicacaoAtual: '',
    pensamentosMorte: '',
    planosSuicida: '',
    tentativasPrevias: '',
    percepRealidade: '',
    alucinacoes: '',
    delírios: '',
    impactoSocial: '',
    impactoProfissional: '',
    medicacaoPrescrita: [],
    dose: '',
    posologia: '',
    recomendacoes: '',
    valorConsulta: '99.90',
    valorLaudo: '0',
    formaPagamento: 'whatsapp'
  });

  const queixasOptions = [
    "Ansiedade excessiva", "Tristeza persistente", "Insônia", 
    "Irritabilidade", "Dificuldade de concentração", "Fadiga constante",
    "Alterações de apetite", "Pensamentos acelerados", "Isolamento social",
    "Medos intensos", "Compulsões", "Alucinações", "Ideias delirantes",
    "Alterações de humor", "Impulsividade", "Problemas de memória",
    "Despersonalização", "Paranoia", "Apatia", "Autoagressão"
  ];

  const medicamentosOptions = [
    "Sertralina", "Escitalopram", "Fluoxetina", "Paroxetina",
    "Venlafaxina", "Duloxetina", "Bupropiona", "Mirtazapina",
    "Clonazepam", "Alprazolam", "Lorazepam", "Diazepam",
    "Quetiapina", "Olanzapina", "Risperidona", "Aripiprazol",
    "Valproato", "Carbamazepina", "Lamotrigina", "Lítio",
    "Metilfenidato", "Atomoxetina", "Modafinila"
  ];

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleQueixa = (queixa) => {
    setFormData(prev => {
      const updated = prev.queixas.includes(queixa)
        ? prev.queixas.filter(q => q !== queixa)
        : [...prev.queixas, queixa];
      return { ...prev, queixas: updated };
    });
  };

  const toggleMedicamento = (med) => {
    setFormData(prev => {
      const updated = prev.medicacaoPrescrita.includes(med)
        ? prev.medicacaoPrescrita.filter(m => m !== med)
        : [...prev.medicacaoPrescrita, med];
      return { ...prev, medicacaoPrescrita: updated };
    });
  };

  const generateWhatsAppMessage = () => {
    const { nome, idade, diagnostico, queixas, pensamentosMorte, percepRealidade, medicacaoPrescrita, dose, posologia, recomendacoes } = formData;
    
    const queixasText = queixas.length > 0 ? queixas.join(', ') : 'Não informado';
    const medicamentosText = medicacaoPrescrita.length > 0 ? medicacaoPrescrita.join(', ') : 'Nenhum prescrito';
    
    return `*CONSULTA PSIQUIÁTRICA - DR. MARCELO MEDEIROS*

*Paciente:* ${nome}
*Idade:* ${idade}
*Diagnóstico principal:* ${diagnostico}

*Queixas principais:* ${queixasText}
*Pensamentos sobre morte:* ${pensamentosMorte}
*Percepção da realidade:* ${percepRealidade}

*Medicação prescrita:* ${medicamentosText}
*Dose:* ${dose}
*Posologia:* ${posologia}

*Recomendações:* ${recomendacoes}

*Valor da consulta:* R$ ${formData.valorConsulta}
*Valor do laudo:* R$ ${formData.valorLaudo}
*Total:* R$ ${(parseFloat(formData.valorConsulta) + parseFloat(formData.valorLaudo)).toFixed(2)}

*COMPROVANTE ANEXADO NO APP*
Por favor, confirme o recebimento.`;
  };

  const sendToWhatsApp = () => {
    const message = generateWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/554491339060?text=${encoded}`, '_blank');
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="step">
            <h2>📋 Dados do Paciente</h2>
            <div className="form-group">
              <label>Nome completo *</label>
              <input 
                type="text" 
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Idade *</label>
              <input 
                type="number" 
                value={formData.idade}
                onChange={(e) => handleChange('idade', e.target.value)}
                min="1"
                max="120"
                required
              />
            </div>
            <div className="form-group">
              <label>Diagnóstico principal *</label>
              <input 
                type="text" 
                value={formData.diagnostico}
                onChange={(e) => handleChange('diagnostico', e.target.value)}
                placeholder="Ex: Transtorno de Ansiedade Generalizada"
                required
              />
            </div>
            <div className="button-group">
              <button onClick={nextStep}>Próximo →</button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step">
            <h2>🔍 Queixas Principais (máx. 10)</h2>
            <p>Selecione até 10 queixas principais:</p>
            <div className="checkbox-grid">
              {queixasOptions.map((queixa, index) => (
                <div key={index} className="checkbox-item">
                  <input 
                    type="checkbox"
                    id={`queixa-${index}`}
                    checked={formData.queixas.includes(queixa)}
                    onChange={() => toggleQueixa(queixa)}
                    disabled={formData.queixas.length >= 10 && !formData.queixas.includes(queixa)}
                  />
                  <label htmlFor={`queixa-${index}`}>{queixa}</label>
                </div>
              ))}
            </div>
            <p className="counter">Selecionadas: {formData.queixas.length}/10</p>
            <div className="button-group">
              <button onClick={prevStep}>← Voltar</button>
              <button onClick={nextStep}>Próximo →</button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step">
            <h2>⚠️ Avaliação de Risco (OBRIGATÓRIO)</h2>
            <div className="form-group">
              <label>Pensamentos sobre morte/autodestrutivos *</label>
              <select 
                value={formData.pensamentosMorte}
                onChange={(e) => handleChange('pensamentosMorte', e.target.value)}
                required
              >
                <option value="">Selecione...</option>
                <option value="Ausentes">Ausentes</option>
                <option value="Passivos (sem planejamento)">Passivos (sem planejamento)</option>
                <option value="Ativos (com planejamento)">Ativos (com planejamento)</option>
                <option value="Tentativa prévia">Tentativa prévia</option>
              </select>
            </div>
            <div className="form-group">
              <label>Planos suicidas específicos</label>
              <input 
                type="text"
                value={formData.planosSuicida}
                onChange={(e) => handleChange('planosSuicida', e.target.value)}
                placeholder="Descreva se houver"
              />
            </div>
            <div className="button-group">
              <button onClick={prevStep}>← Voltar</button>
              <button onClick={nextStep}>Próximo →</button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step">
            <h2>🧠 Percepção da Realidade (OBRIGATÓRIO)</h2>
            <div className="form-group">
              <label>Percepção da realidade/orientação *</label>
              <select 
                value={formData.percepRealidade}
                onChange={(e) => handleChange('percepRealidade', e.target.value)}
                required
              >
                <option value="">Selecione...</option>
                <option value="Preservada">Preservada</option>
                <option value="Levemente comprometida">Levemente comprometida</option>
                <option value="Moderadamente comprometida">Moderadamente comprometida</option>
                <option value="Gravemente comprometida">Gravemente comprometida</option>
              </select>
            </div>
            <div className="form-group">
              <label>Alucinações (se houver)</label>
              <input 
                type="text"
                value={formData.alucinacoes}
                onChange={(e) => handleChange('alucinacoes', e.target.value)}
                placeholder="Descreva tipo e frequência"
              />
            </div>
            <div className="button-group">
              <button onClick={prevStep}>← Voltar</button>
              <button onClick={nextStep}>Próximo →</button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step">
            <h2>💊 Conduta Terapêutica</h2>
            <div className="form-group">
              <label>Medicação prescrita *</label>
              <p>Selecione os medicamentos:</p>
              <div className="checkbox-grid">
                {medicamentosOptions.map((med, index) => (
                  <div key={index} className="checkbox-item">
                    <input 
                      type="checkbox"
                      id={`med-${index}`}
                      checked={formData.medicacaoPrescrita.includes(med)}
                      onChange={() => toggleMedicamento(med)}
                    />
                    <label htmlFor={`med-${index}`}>{med}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Dose</label>
              <input 
                type="text"
                value={formData.dose}
                onChange={(e) => handleChange('dose', e.target.value)}
                placeholder="Ex: 50mg"
              />
            </div>
            <div className="form-group">
              <label>Posologia</label>
              <input 
                type="text"
                value={formData.posologia}
                onChange={(e) => handleChange('posologia', e.target.value)}
                placeholder="Ex: 1x ao dia"
              />
            </div>
            <div className="button-group">
              <button onClick={prevStep}>← Voltar</button>
              <button onClick={nextStep}>Próximo →</button>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="step">
            <h2>💰 Pagamento</h2>
            <div className="price-summary">
              <div className="price-item">
                <span>Consulta Online (30min)</span>
                <span>R$ {formData.valorConsulta}</span>
              </div>
              <div className="price-item">
                <span>Laudo Psiquiátrico (sem RQE)</span>
                <span>
                  <input 
                    type="checkbox"
                    checked={formData.valorLaudo === '80.00'}
                    onChange={(e) => handleChange('valorLaudo', e.target.checked ? '80.00' : '0')}
                  /> R$ 80,00
                </span>
              </div>
              <div className="price-item">
                <span>Laudo Psiquiátrico (com RQE)</span>
                <span>
                  <input 
                    type="checkbox"
                    checked={formData.valorLaudo === '250.00'}
                    onChange={(e) => handleChange('valorLaudo', e.target.checked ? '250.00' : '0')}
                  /> R$ 250,00
                </span>
              </div>
              <div className="price-total">
                <strong>TOTAL</strong>
                <strong>
                  R$ {(parseFloat(formData.valorConsulta) + parseFloat(formData.valorLaudo)).toFixed(2)}
                </strong>
              </div>
            </div>
            <div className="warning-box">
              ⚠️ <strong>Importante:</strong> Anexe o comprovante no app primeiro, 
              depois envie a mensagem pelo WhatsApp para confirmação.
            </div>
            <div className="button-group">
              <button onClick={prevStep}>← Voltar</button>
              <button onClick={sendToWhatsApp} className="whatsapp-btn">
                📱 Enviar via WhatsApp
              </button>
            </div>
          </div>
        );

      default:
        return <div>Etapa não encontrada</div>;
    }
  };

  return (
    <div className="app-container">
      <div className="progress-bar">
        <div className="progress" style={{ width: `${(step / 6) * 100}%` }}></div>
      </div>
      <div className="step-indicator">
        Etapa {step} de 6
      </div>
      <div className="form-container">
        {renderStep()}
      </div>
    </div>
  );
}

const style = document.createElement('style');
style.textContent = `
  .app-container { max-width: 800px; margin: 20px auto; padding: 0 16px; }
  .progress-bar { height: 8px; background: #e5e7eb; border-radius: 4px; margin-bottom: 20px; overflow: hidden; }
  .progress { height: 100%; background: #0d9488; transition: width 0.3s; }
  .step-indicator { text-align: center; color: #6b7280; margin-bottom: 30px; font-weight: 600; }
  .form-container { background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
  .step h2 { color: #0f766e; margin-top: 0; margin-bottom: 25px; }
  .form-group { margin-bottom: 20px; }
  .form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #374151; }
  .form-group input, .form-group select { width: 100%; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 16px; }
  .form-group input:focus, .form-group select:focus { border-color: #0d9488; outline: none; }
  .checkbox-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; margin: 20px 0; }
  .checkbox-item { display: flex; align-items: center; padding: 10px; background: #f8fafc; border-radius: 8px; border: 2px solid #e5e7eb; }
  .checkbox-item input[type="checkbox"] { margin-right: 10px; transform: scale(1.2); }
  .button-group { display: flex; justify-content: space-between; margin-top: 30px; gap: 15px; }
  button { padding: 14px 28px; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s; flex: 1; }
  button:first-child { background: #f3f4f6; color: #4b5563; }
  button:first-child:hover { background: #e5e7eb; }
  button:last-child:not(.whatsapp-btn) { background: #0d9488; color: white; }
  button:last-child:not(.whatsapp-btn):hover { background: #0f766e; }
  .whatsapp-btn { background: #25d366 !important; color: white !important; }
  .whatsapp-btn:hover { background: #128C7E !important; }
  .counter { text-align: center; color: #6b7280; font-style: italic; }
  .price-summary { background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0; }
  .price-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
  .price-total { display: flex; justify-content: space-between; padding: 15px 0; font-size: 1.2em; color: #0f766e; }
  .warning-box { background: #fef3c7; border-left: 4px solid #d97706; padding: 15px; border-radius: 8px; margin: 20px 0; }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
