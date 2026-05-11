import { CalendarCheck, LockKeyhole, Mail } from 'lucide-react';
import { Footer } from '../components/Footer';

const demoExternalUrl = '#/agendar/clinica-aurora-beta';

export function Login(){return <div className="auth-page"><div className="auth-card"><a className="brand center" href="#/"><span><CalendarCheck size={22}/></span><b>AgendaPro Beta</b></a><h1>Área de acesso</h1><p>O login real do cliente fica em <b>Minha conta</b>. Este beta roda separado da produção e usa dados simulados.</p><label><Mail size={18}/><input defaultValue="" aria-label="E-mail" placeholder="seu@email.com"/></label><label><LockKeyhole size={18}/><input type="password" defaultValue="" aria-label="Senha" placeholder="Sua senha"/></label><a href="#/conta/login" className="btn primary full">Entrar na minha conta</a><a href={demoExternalUrl} target="_blank" rel="noopener noreferrer" className="btn secondary full">Abrir agenda beta</a><small>Ambiente beta isolado: sem Supabase de produção e sem pagamento real.</small></div><Footer/></div>}
