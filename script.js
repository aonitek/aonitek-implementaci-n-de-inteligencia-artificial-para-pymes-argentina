tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        aonitek: {
                            base: '#0F1117',
                            card: '#1A1D27',
                            border: '#2A2D3A',
                            green: '#1D9E75',
                            text: '#FFFFFF',
                            muted: '#8B8FA8'
                        }
                    },
                    fontFamily: {
                        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
                    }
                }
            }
        }

document.addEventListener('DOMContentLoaded', function() {
                const sliders = {
                    consultas: document.getElementById('consultas'),
                    sinRespuesta: document.getElementById('sinRespuesta'),
                    ticket: document.getElementById('ticket'),
                    horas: document.getElementById('horas'),
                    costoHora: document.getElementById('costoHora'),
                    inversion: document.getElementById('inversion')
                };

                const outputs = {
                    consultas: document.getElementById('valConsultas'),
                    sinRespuesta: document.getElementById('valSinRespuesta'),
                    ticket: document.getElementById('valTicket'),
                    horas: document.getElementById('valHoras'),
                    costoHora: document.getElementById('valCostoHora'),
                    inversion: document.getElementById('valInversion')
                };

                const results = {
                    total: document.getElementById('resTotal'),
                    leads: document.getElementById('resLeads'),
                    leadsCount: document.getElementById('resLeadsCount'),
                    horas: document.getElementById('resHoras'),
                    horasCount: document.getElementById('resHorasCount'),
                    roi: document.getElementById('resRoi'),
                    payback: document.getElementById('resPayback'),
                    conclusion: document.getElementById('resConclusion')
                };

                // Constants
                const CONVERSION_RATE = 0.10; // Assuming a 10% closing rate on lost leads to be realistic

                function formatCurrency(num) {
                    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
                }

                function calculate() {
                    const vals = {
                        consultas: parseFloat(sliders.consultas.value),
                        sinRespuesta: parseFloat(sliders.sinRespuesta.value),
                        ticket: parseFloat(sliders.ticket.value),
                        horas: parseFloat(sliders.horas.value),
                        costoHora: parseFloat(sliders.costoHora.value),
                        inversion: parseFloat(sliders.inversion.value)
                    };

                    // Update UI text values
                    outputs.consultas.textContent = vals.consultas;
                    outputs.sinRespuesta.textContent = vals.sinRespuesta + '%';
                    outputs.ticket.textContent = formatCurrency(vals.ticket);
                    outputs.horas.textContent = vals.horas + ' hs';
                    outputs.costoHora.textContent = formatCurrency(vals.costoHora);
                    outputs.inversion.textContent = formatCurrency(vals.inversion);

                    // Update slider track gradient percentages
                    Object.keys(sliders).forEach(key => {
                        const el = sliders[key];
                        const min = parseFloat(el.min) || 0;
                        const max = parseFloat(el.max) || 100;
                        const val = parseFloat(el.value);
                        const percentage = ((val - min) / (max - min)) * 100;
                        el.style.setProperty('--progress', `${percentage}%`);
                    });

                    // MATH / LOGIC
                    const leadsPerdidosMes = Math.round(vals.consultas * (vals.sinRespuesta / 100) * 30);
                    const ventasPerdidasUsd = leadsPerdidosMes * CONVERSION_RATE * vals.ticket;
                    
                    const horasPerdidasMes = vals.horas * 30;
                    const costoHorasUsd = horasPerdidasMes * vals.costoHora;

                    const perdidaTotal = ventasPerdidasUsd + costoHorasUsd;
                    
                    const roi = ((perdidaTotal - vals.inversion) / vals.inversion) * 100;
                    
                    // Daily savings = perdidaTotal / 30 days
                    const dailySavings = perdidaTotal / 30;
                    let paybackDays = 0;
                    
                    if (dailySavings > 0) {
                        paybackDays = vals.inversion / dailySavings;
                    }

                    // Render Final Data
                    results.total.textContent = formatCurrency(perdidaTotal);
                    
                    results.leads.textContent = formatCurrency(ventasPerdidasUsd);
                    results.leadsCount.textContent = `${leadsPerdidosMes} leads perdidos/mes`;
                    
                    results.horas.textContent = formatCurrency(costoHorasUsd);
                    results.horasCount.textContent = `${horasPerdidasMes} horas perdidas/mes`;

                    if (roi > 0) {
                        results.roi.textContent = '+' + Math.round(roi).toLocaleString() + '%';
                        results.roi.className = "text-3xl font-black transition-colors duration-300 text-aonitek-green";
                    } else {
                        results.roi.textContent = Math.round(roi).toLocaleString() + '%';
                        results.roi.className = "text-3xl font-black transition-colors duration-300 text-red-500";
                    }

                    // Precise Payback Logic (Strictly days in the exact requested format: 1 día, 2 días, 3 días...)
                    if (perdidaTotal === 0 || dailySavings === 0) {
                        results.payback.textContent = "N/A";
                    } else {
                        const days = Math.max(1, Math.ceil(paybackDays));
                        results.payback.textContent = days === 1 ? "1 día" : days + " días";
                    }

                    // Render Dynamic Conclusion
                    if (roi > 500) {
                        results.conclusion.innerHTML = "Tu negocio pierde <strong>" + formatCurrency(perdidaTotal) + "</strong> mensuales. La suscripción de " + formatCurrency(vals.inversion) + " se paga sola en <strong>" + results.payback.textContent.toLowerCase() + "</strong>.";
                    } else if (roi > 0) {
                        results.conclusion.innerHTML = "Rentabilidad positiva. Automatizar tu atención cubrirá su costo rápidamente y generará un ahorro de <strong>" + formatCurrency(perdidaTotal) + "</strong> al mes.";
                    } else {
                        results.conclusion.innerHTML = "Ajusta los valores para calcular tu retorno de inversión.";
                    }
                }

                // Bind events to sliders
                Object.values(sliders).forEach(slider => {
                    slider.addEventListener('input', calculate);
                });

                // Init
                calculate();
            });

document.addEventListener('DOMContentLoaded', () => {
            // Set footer year
            document.getElementById('year').textContent = '2026';

            // Constants
            const DIAS_MES = 30; // Promedio estándar de días para un negocio online/atención continua

            // DOM Elements - Inputs
            const sliders = document.querySelectorAll('.interactive-slider');
            const inputs = {
                consultas: document.getElementById('consultas'),
                sinRespuesta: document.getElementById('sinRespuesta'),
                ticket: document.getElementById('ticket'),
                horas: document.getElementById('horas'),
                costoHora: document.getElementById('costoHora'),
                inversion: document.getElementById('inversion')
            };

            // DOM Elements - Input Value Displays
            const displays = {
                consultas: document.getElementById('valConsultas'),
                sinRespuesta: document.getElementById('valSinRespuesta'),
                ticket: document.getElementById('valTicket'),
                horas: document.getElementById('valHoras'),
                costoHora: document.getElementById('valCostoHora'),
                inversion: document.getElementById('valInversion')
            };

            // DOM Elements - Results
            const results = {
                total: document.getElementById('resTotal'),
                leadsValue: document.getElementById('resLeads'),
                leadsCount: document.getElementById('resLeadsCount'),
                horasValue: document.getElementById('resHoras'),
                horasCount: document.getElementById('resHorasCount'),
                roi: document.getElementById('resRoi'),
                payback: document.getElementById('resPayback'),
                conclusion: document.getElementById('resConclusion')
            };

            // Formatters
            const formatMoney = (value) => {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0
                }).format(value);
            };

            const formatNumber = (value) => {
                return new Intl.NumberFormat('en-US', {
                    maximumFractionDigits: 0
                }).format(value);
            };

            // ===== CSS VARIABLE UPDATER FOR SLIDER TRACK =====
            // Function: updateSliderProgress(slider)
            // Purpose: Calculates the percentage of the slider to fill the green track background
            const updateSliderProgress = (slider) => {
                const min = slider.min || 0;
                const max = slider.max || 100;
                const val = slider.value;
                const percentage = ((val - min) / (max - min)) * 100;
                slider.style.setProperty('--progress', `${percentage}%`);
            };

            // ===== MAIN CALCULATOR LOGIC =====
            // Function: calculateROI()
            // Purpose: Gathers values, performs business logic math, updates result UI
            const calculateROI = () => {
                // Parse current values
                const vConsultas = parseFloat(inputs.consultas.value);
                const vSinRespuesta = parseFloat(inputs.sinRespuesta.value) / 100;
                const vTicket = parseFloat(inputs.ticket.value);
                const vHoras = parseFloat(inputs.horas.value);
                const vCostoHora = parseFloat(inputs.costoHora.value);
                const vInversion = parseFloat(inputs.inversion.value);

                // Update UI Labels next to sliders
                displays.consultas.textContent = formatNumber(vConsultas);
                displays.sinRespuesta.textContent = `${inputs.sinRespuesta.value}%`;
                displays.ticket.textContent = formatMoney(vTicket);
                displays.horas.textContent = `${vHoras} hs`;
                displays.costoHora.textContent = formatMoney(vCostoHora);
                displays.inversion.textContent = formatMoney(vInversion);

                // Math Logic
                // 1. Pérdida por Ventas (Leads)
                const leadsPerdidosMes = Math.round(vConsultas * vSinRespuesta * DIAS_MES);
                const perdidaVentasMes = leadsPerdidosMes * vTicket;

                // 2. Pérdida por Horas Improductivas
                const horasPerdidasMes = Math.round(vHoras * DIAS_MES);
                const costoHorasMes = horasPerdidasMes * vCostoHora;

                // 3. Pérdida Total Mensual
                const perdidaTotal = perdidaVentasMes + costoHorasMes;

                // 4. ROI y Payback
                // ROI Formula: ((Ganancia de Inversión - Costo de Inversión) / Costo de Inversión) * 100
                // Asumimos que el Empleado Digital ahorra/recupera el 100% de esta pérdida
                const roi = ((perdidaTotal - vInversion) / vInversion) * 100;
                
                // Payback en días = Costo Inversión / Ahorro Diario
                const ahorroDiario = perdidaTotal / DIAS_MES;
                const diasRecupero = vInversion / ahorroDiario;

                // Update UI Results
                results.total.textContent = formatMoney(perdidaTotal);
                
                results.leadsValue.textContent = formatMoney(perdidaVentasMes);
                results.leadsCount.textContent = `${formatNumber(leadsPerdidosMes)} leads perdidos al mes`;
                
                results.horasValue.textContent = formatMoney(costoHorasMes);
                results.horasCount.textContent = `${formatNumber(horasPerdidasMes)} horas perdidas al mes`;

                // Conditionally format ROI
                const roiFormatted = formatNumber(Math.max(0, roi));
                results.roi.textContent = `${roiFormatted}%`;
                
                // Color coding for ROI
                results.roi.className = 'text-3xl font-black transition-colors duration-300'; // reset
                if (roi > 500) {
                    results.roi.classList.add('text-aonitek-green');
                } else if (roi > 100) {
                    results.roi.classList.add('text-blue-400');
                } else if (roi > 0) {
                    results.roi.classList.add('text-yellow-400');
                } else {
                    results.roi.classList.add('text-red-400');
                }

              // Format Payback String let paybackText = ""; if (diasRecupero < 7) { const dias = Math.round(diasRecupero); paybackText = ${dias} día${dias > 1 ? 's' : ''}; } else if (diasRecupero < 30) { const semanas = Math.max(1, Math.round(diasRecupero / 7)); paybackText = ${semanas} semana${semanas > 1 ? 's' : ''}; } else { const meses = (diasRecupero / 30).toFixed(1); paybackText = ${meses} mes${meses !== "1.0" ? 'es' : ''}; } 
                results.payback.textContent = paybackText;

                // Dynamic Conclusion Text Based on ROI
                let conclusionMsg = "";
                if (roi > 1000) {
                    conclusionMsg = "¡Tu potencial de mejora es enorme! Estás perdiendo una cantidad crítica de ingresos y horas que un Empleado Digital de Aonitek podría recuperar de inmediato. Tu retorno sería extraordinario.";
                } else if (roi > 300) {
                    conclusionMsg = "Excelente oportunidad de automatización. El costo oculto está afectando claramente tus márgenes. Implementar esta solución se pagaría por sí sola de forma muy rápida.";
                } else if (roi > 100) {
                    conclusionMsg = "Un Empleado Digital es una inversión inteligente para tu operación actual. Te permitirá recuperar ingresos perdidos y optimizar el tiempo de tu equipo de manera rentable.";
                } else {
                    conclusionMsg = "Incluso en tu escala actual, automatizar te ofrece un retorno positivo, ayudándote a construir una base sólida y escalable para cuando tu volumen de consultas crezca.";
                }
                results.conclusion.textContent = conclusionMsg;
            };

            // Event Listeners Initialization
            sliders.forEach(slider => {
                // Initial setup
                updateSliderProgress(slider);
                
                // Live update on drag
                slider.addEventListener('input', (e) => {
                    updateSliderProgress(e.target);
                    calculateROI();
                });
            });

            // Perform initial calculation on page load
            calculateROI();
        });