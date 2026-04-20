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
                
                // ===== CONSTANTES GLOBALES =====
                // TASA DE CIERRE: 15% - Este es el factor crítico que se aplica a TODAS las pérdidas
                const CONVERSION_RATE = 0.15; // Tasa de cierre del 15% - NO MODIFICAR
                const DIAS_MES = 30;

                // ===== ELEMENTOS DOM - INPUTS =====
                const sliders = {
                    consultas: document.getElementById('consultas'),
                    sinRespuesta: document.getElementById('sinRespuesta'),
                    ticket: document.getElementById('ticket'),
                    horas: document.getElementById('horas'),
                    costoHora: document.getElementById('costoHora'),
                    inversion: document.getElementById('inversion')
                };

                // ===== ELEMENTOS DOM - DISPLAY VALUES =====
                const outputs = {
                    consultas: document.getElementById('valConsultas'),
                    sinRespuesta: document.getElementById('valSinRespuesta'),
                    ticket: document.getElementById('valTicket'),
                    horas: document.getElementById('valHoras'),
                    costoHora: document.getElementById('valCostoHora'),
                    inversion: document.getElementById('valInversion')
                };

                // ===== ELEMENTOS DOM - RESULTADOS =====
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

                // ===== FUNCIONES AUXILIARES =====
                // Formatea números a moneda USD
                function formatCurrency(num) {
                    return new Intl.NumberFormat('en-US', { 
                        style: 'currency', 
                        currency: 'USD', 
                        maximumFractionDigits: 0 
                    }).format(num);
                }

                // Formatea números con separadores de miles
                function formatNumber(num) {
                    return new Intl.NumberFormat('en-US', { 
                        maximumFractionDigits: 0 
                    }).format(num);
                }

                // Actualiza el progreso visual del slider
                function updateSliderProgress(slider) {
                    const min = parseFloat(slider.min) || 0;
                    const max = parseFloat(slider.max) || 100;
                    const val = parseFloat(slider.value);
                    const percentage = ((val - min) / (max - min)) * 100;
                    slider.style.setProperty('--progress', `${percentage}%`);
                }

                // ===== FUNCIÓN PRINCIPAL DE CÁLCULO =====
                // IMPORTANTE: Esta función es la ÚNICA fuente de verdad para todos los cálculos
                function calculate() {
                    
                    // ===== PASO 1: OBTENER VALORES DE LOS SLIDERS =====
                    const vals = {
                        consultas: parseFloat(sliders.consultas.value),
                        sinRespuesta: parseFloat(sliders.sinRespuesta.value),
                        ticket: parseFloat(sliders.ticket.value),
                        horas: parseFloat(sliders.horas.value),
                        costoHora: parseFloat(sliders.costoHora.value),
                        inversion: parseFloat(sliders.inversion.value)
                    };

                    // ===== PASO 2: ACTUALIZAR LABELS DE DISPLAY (junto a los sliders) =====
                    outputs.consultas.textContent = formatNumber(vals.consultas);
                    outputs.sinRespuesta.textContent = vals.sinRespuesta + '%';
                    outputs.ticket.textContent = formatCurrency(vals.ticket);
                    outputs.horas.textContent = vals.horas + ' hs';
                    outputs.costoHora.textContent = formatCurrency(vals.costoHora);
                    outputs.inversion.textContent = formatCurrency(vals.inversion);

                    // ===== PASO 3: ACTUALIZAR PROGRESO VISUAL DE SLIDERS =====
                    Object.values(sliders).forEach(slider => {
                        updateSliderProgress(slider);
                    });

                    // ===== PASO 4: CÁLCULOS PRINCIPALES (APLICANDO TASA DE CIERRE DEL 15%) =====
                    
                    // 1. Calcular leads perdidos reales (solo los que quedan sin respuesta)
                    const leadsPerdidosMes = Math.round(vals.consultas * (vals.sinRespuesta / 100) * DIAS_MES);
                    
                    // 2. Calcular las ventas perdidas aplicando el 15% de cierre de manera estricta
                    const ventasPerdidasUsd = leadsPerdidosMes * vals.ticket * CONVERSION_RATE;
                    
                    // 3. Calcular el costo de horas improductivas
                    const horasPerdidasMes = Math.round(vals.horas * DIAS_MES);
                    const costoHorasUsd = horasPerdidasMes * vals.costoHora;

                    // 4. Pérdida total unificada (usada en todas partes de manera consistente)
                    const perdidaTotal = ventasPerdidasUsd + costoHorasUsd;
                    
                    // Cálculos de ROI y Payback
                    const roi = ((perdidaTotal - vals.inversion) / vals.inversion) * 100;
                    const ahorroDiario = perdidaTotal / DIAS_MES;
                    const diasPayback = vals.inversion / ahorroDiario;

                    // ===== PASO 5: RENDERIZAR RESULTADOS EN EL DOM =====
                    
                    // 5A. Pérdida Total (caja principal grande)
                    results.total.textContent = formatCurrency(perdidaTotal);
                    
                    // 5B. Ventas Perdidas (caja de breakdown)
                    results.leads.textContent = formatCurrency(ventasPerdidasUsd);
                    results.leadsCount.textContent = `${formatNumber(leadsPerdidosMes)} leads perdidos al mes`;
                    
                    // 5C. Horas Improductivas (caja de breakdown)
                    results.horas.textContent = formatCurrency(costoHorasUsd);
                    results.horasCount.textContent = `${formatNumber(horasPerdidasMes)} horas perdidas al mes`;

                    // 5D. ROI con color dinámico
                    const roiFormato = formatNumber(Math.max(0, roi));
                    if (roi > 0) {
                        results.roi.textContent = '+' + roiFormato + '%';
                        results.roi.className = 'text-3xl font-black transition-colors duration-300 text-aonitek-green';
                    } else {
                        results.roi.textContent = roiFormato + '%';
                        results.roi.className = 'text-3xl font-black transition-colors duration-300 text-red-500';
                    }

                    // 5E. Período de Recuperación (Payback)
                    let paybackText = '';
                    if (diasPayback < 7) {
                        const dias = Math.round(diasPayback);
                        paybackText = `${dias} día${dias > 1 ? 's' : ''}`;
                    } else if (diasPayback < 30) {
                        const semanas = Math.max(1, Math.round(diasPayback / 7));
                        paybackText = `${semanas} semana${semanas > 1 ? 's' : ''}`;
                    } else {
                        const meses = (diasPayback / 30).toFixed(1);
                        paybackText = `${meses} mes${meses !== '1.0' ? 'es' : ''}`;
                    }
                    results.payback.textContent = paybackText;

                    // ===== PASO 6: RENDERIZAR CONCLUSIÓN DINÁMICA =====
                    // IMPORTANTE: Usa la misma perdidaTotal que se muestra en la caja principal
                    // y el mismo cálculo de ventas perdidas (con 15% aplicado)
                    if (roi > 500) {
                        results.conclusion.innerHTML = `Tu negocio pierde <strong>${formatCurrency(perdidaTotal)}</strong> mensuales por consultas sin respuesta oportuna (calculado con tasa de cierre realista del 15%).<br>La suscripción de <strong>${formatCurrency(vals.inversion)}</strong> se paga sola en <strong>${results.payback.textContent.toLowerCase()}</strong>.`;
                    } else if (roi > 0) {
                        results.conclusion.innerHTML = `Rentabilidad positiva. Automatizar tu atención cubrirá su costo rápidamente y generará un ahorro de <strong>${formatCurrency(perdidaTotal)}</strong> al mes (con cierre del 15%).`;
                    } else {
                        results.conclusion.innerHTML = 'Ajusta los valores para calcular tu retorno de inversión.';
                    }
                }

                // ===== EVENT LISTENERS =====
                // Bind todos los sliders al evento de cálculo
                Object.values(sliders).forEach(slider => {
                    slider.addEventListener('input', calculate);
                });

                // Inicializar cálculo al cargar la página
                calculate();
            });

// Set footer year
        document.getElementById('year').textContent = '2026';