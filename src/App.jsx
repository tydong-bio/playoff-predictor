
import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from './lib.supabase'

const ADMIN_PASSWORD = 'nba-admin'
const STAGES = ['Conference Finals', 'Round 2', 'Round 1', 'Play-In']
const CONFS = ['East', 'West']
const SCORE_OPTIONS = ['4:0', '4:1', '4:2', '4:3']

const TEAM_META = {
  Celtics: { full: '波士顿凯尔特人', short: '凯尔特人', logo: 'https://cdn.nba.com/logos/nba/1610612738/global/L/logo.svg' },
  Knicks: { full: '纽约尼克斯', short: '尼克斯', logo: 'https://cdn.nba.com/logos/nba/1610612752/global/L/logo.svg' },
  Bucks: { full: '密尔沃基雄鹿', short: '雄鹿', logo: 'https://cdn.nba.com/logos/nba/1610612749/global/L/logo.svg' },
  Cavaliers: { full: '克利夫兰骑士', short: '骑士', logo: 'https://cdn.nba.com/logos/nba/1610612739/global/L/logo.svg' },
  Magic: { full: '奥兰多魔术', short: '魔术', logo: 'https://cdn.nba.com/logos/nba/1610612753/global/L/logo.svg' },
  Pacers: { full: '印第安纳步行者', short: '步行者', logo: 'https://cdn.nba.com/logos/nba/1610612754/global/L/logo.svg' },
  "76ers": { full: '费城76人', short: '76人', logo: 'https://cdn.nba.com/logos/nba/1610612755/global/L/logo.svg' },
  Heat: { full: '迈阿密热火', short: '热火', logo: 'https://cdn.nba.com/logos/nba/1610612748/global/L/logo.svg' },
  Bulls: { full: '芝加哥公牛', short: '公牛', logo: 'https://cdn.nba.com/logos/nba/1610612741/global/L/logo.svg' },
  Hawks: { full: '亚特兰大老鹰', short: '老鹰', logo: 'https://cdn.nba.com/logos/nba/1610612737/global/L/logo.svg' },
  Hornets: { full: '夏洛特黄蜂', short: '黄蜂', logo: 'https://cdn.nba.com/logos/nba/1610612766/global/L/logo.svg' },
  Nets: { full: '布鲁克林篮网', short: '篮网', logo: 'https://cdn.nba.com/logos/nba/1610612751/global/L/logo.svg' },
  Raptors: { full: '多伦多猛龙', short: '猛龙', logo: 'https://cdn.nba.com/logos/nba/1610612761/global/L/logo.svg' },
  Pistons: { full: '底特律活塞', short: '活塞', logo: 'https://cdn.nba.com/logos/nba/1610612765/global/L/logo.svg' },
  Wizards: { full: '华盛顿奇才', short: '奇才', logo: 'https://cdn.nba.com/logos/nba/1610612764/global/L/logo.svg' },

  Thunder: { full: '俄克拉荷马城雷霆', short: '雷霆', logo: 'https://cdn.nba.com/logos/nba/1610612760/global/L/logo.svg' },
  Nuggets: { full: '丹佛掘金', short: '掘金', logo: 'https://cdn.nba.com/logos/nba/1610612743/global/L/logo.svg' },
  Timberwolves: { full: '明尼苏达森林狼', short: '森林狼', logo: 'https://cdn.nba.com/logos/nba/1610612750/global/L/logo.svg' },
  Suns: { full: '菲尼克斯太阳', short: '太阳', logo: 'https://cdn.nba.com/logos/nba/1610612756/global/L/logo.svg' },
  Lakers: { full: '洛杉矶湖人', short: '湖人', logo: 'https://cdn.nba.com/logos/nba/1610612747/global/L/logo.svg' },
  Warriors: { full: '金州勇士', short: '勇士', logo: 'https://cdn.nba.com/logos/nba/1610612744/global/L/logo.svg' },
  Clippers: { full: '洛杉矶快船', short: '快船', logo: 'https://cdn.nba.com/logos/nba/1610612746/global/L/logo.svg' },
  Kings: { full: '萨克拉门托国王', short: '国王', logo: 'https://cdn.nba.com/logos/nba/1610612758/global/L/logo.svg' },
  Pelicans: { full: '新奥尔良鹈鹕', short: '鹈鹕', logo: 'https://cdn.nba.com/logos/nba/1610612740/global/L/logo.svg' },
  Mavericks: { full: '达拉斯独行侠', short: '独行侠', logo: 'https://cdn.nba.com/logos/nba/1610612742/global/L/logo.svg' },
  Grizzlies: { full: '孟菲斯灰熊', short: '灰熊', logo: 'https://cdn.nba.com/logos/nba/1610612763/global/L/logo.svg' },
  Rockets: { full: '休斯敦火箭', short: '火箭', logo: 'https://cdn.nba.com/logos/nba/1610612745/global/L/logo.svg' },
  Spurs: { full: '圣安东尼奥马刺', short: '马刺', logo: 'https://cdn.nba.com/logos/nba/1610612759/global/L/logo.svg' },
  Jazz: { full: '犹他爵士', short: '爵士', logo: 'https://cdn.nba.com/logos/nba/1610612762/global/L/logo.svg' },
  "Trail Blazers": { full: '波特兰开拓者', short: '开拓者', logo: 'https://cdn.nba.com/logos/nba/1610612757/global/L/logo.svg' },

  "East 1": { full: '东部第1', short: '东1' },
  "East 2": { full: '东部第2', short: '东2' },
  "East 3": { full: '东部第3', short: '东3' },
  "East 4": { full: '东部第4', short: '东4' },
  "East 5": { full: '东部第5', short: '东5' },
  "East 6": { full: '东部第6', short: '东6' },
  "East 7": { full: '东部第7', short: '东7' },
  "East 8": { full: '东部第8', short: '东8' },
  "West 1": { full: '西部第1', short: '西1' },
  "West 2": { full: '西部第2', short: '西2' },
  "West 3": { full: '西部第3', short: '西3' },
  "West 4": { full: '西部第4', short: '西4' },
  "West 5": { full: '西部第5', short: '西5' },
  "West 6": { full: '西部第6', short: '西6' },
  "West 7": { full: '西部第7', short: '西7' },
  "West 8": { full: '西部第8', short: '西8' },
  "Loser 7/8": { full: '7/8败者', short: '7/8败者' },
  "Winner 9/10": { full: '9/10胜者', short: '9/10胜者' },
}

const EAST_TEAMS = ['Celtics', 'Knicks', 'Bucks', 'Cavaliers', 'Magic', 'Pacers', '76ers', 'Heat', 'Bulls', 'Hawks', 'Hornets', 'Nets', 'Raptors', 'Pistons', 'Wizards']
const WEST_TEAMS = ['Thunder', 'Nuggets', 'Timberwolves', 'Suns', 'Lakers', 'Warriors', 'Clippers', 'Kings', 'Pelicans', 'Mavericks', 'Grizzlies', 'Rockets', 'Spurs', 'Jazz', 'Trail Blazers']

const PLAYIN_SEED = [
  { pool:'demo', matchup_id:'e_910', stage:'Play-In', conference:'East', round_label:'9/10', matchup_type:'play_in', team_a:'Heat', team_b:'Hornets', starts_at:'2026-04-15T11:30:00Z', sort_order:1 },
  { pool:'demo', matchup_id:'w_78', stage:'Play-In', conference:'West', round_label:'7/8', matchup_type:'play_in', team_a:'Trail Blazers', team_b:'Suns', starts_at:'2026-04-15T14:00:00Z', sort_order:2 },
]
const PLAYOFF_SEED = [
  { pool:'demo', matchup_id:'east_r1_1', stage:'Playoffs', conference:'East', round_label:'First Round', matchup_type:'series', team_a:'Celtics', team_b:'Knicks', starts_at:null, sort_order:101 },
  { pool:'demo', matchup_id:'west_r1_1', stage:'Playoffs', conference:'West', round_label:'First Round', matchup_type:'series', team_a:'Clippers', team_b:'Warriors', starts_at:null, sort_order:201 },
]

function fullName(name){ return TEAM_META[name]?.full || name }
function shortName(name){ return TEAM_META[name]?.short || name }
function teamLogo(name){ return TEAM_META[name]?.logo || '' }
function isRocketsLakersSeries(matchup){ const set = new Set([matchup.team_a, matchup.team_b]); return set.has('Rockets') && set.has('Lakers') }

function TeamBadge({ name, small=false }) {
  const logo = teamLogo(name)
  return (
    <span className={`teamBadge ${small ? 'small' : ''}`}>
      {logo ? <img src={logo} alt={name} className={`teamLogo ${name === 'Rockets' ? 'rocketsLogo' : ''}`} /> : <span className="teamLogoPlaceholder" />}
      <span>{fullName(name)}</span>
    </span>
  )
}

function fmt(iso){
  if(!iso) return 'TBD'
  const d = new Date(iso)
  if(Number.isNaN(d.getTime())) return iso
  return d.toLocaleString([], { month:'short', day:'numeric', hour:'numeric', minute:'2-digit' })
}
function toDatetimeLocalValue(value){
  if(!value) return ''
  const d=new Date(value)
  if(Number.isNaN(d.getTime())) return ''
  const p=n=>String(n).padStart(2,'0')
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}
function fromDatetimeLocalValue(value){
  if(!value) return null
  const d=new Date(value)
  if(Number.isNaN(d.getTime())) return null
  return d.toISOString()
}

function isPredictionClosed(startsAt, actualWinner){
  if (actualWinner) return true
  if (!startsAt) return false
  const t = new Date(startsAt).getTime()
  if (Number.isNaN(t)) return false
  return Date.now() >= t
}
function isSeriesPredictionClosed(matchup, gamesByMatchup){
  if (matchup.actual_winner) return true
  const matchupGames = gamesByMatchup[matchup.matchup_id] || []
  const g1 = matchupGames.find(g => g.game_no === 1 || g.label === 'G1')
  if (!g1?.starts_at) return false
  const t = new Date(g1.starts_at).getTime()
  if (Number.isNaN(t)) return false
  return Date.now() >= t
}
function seriesScoreTextForDisplay(p, matchup){
  if(p.picked_score_a == null || p.picked_score_b == null) return ''
  if(p.picked_winner === matchup.team_a) return `${p.picked_score_a}:${p.picked_score_b}`
  if(p.picked_winner === matchup.team_b) return `${p.picked_score_b}:${p.picked_score_a}`
  return ''
}
function parseSeriesScoreForWinner(winner, score, teamA, teamB){
  const [l,r]=score.split(':').map(Number)
  if(winner===teamA) return {a:l,b:r}
  if(winner===teamB) return {a:r,b:l}
  return {a:null,b:null}
}
function lineClass(isMine,isCorrect,isWrong){
  let c='pickLine'
  if(isMine) c+=' mine'
  if(isCorrect) c+=' correct'
  if(isWrong) c+=' wrong'
  return c
}
function sortByTime(items){
  return [...items].sort((a,b)=>{
    const ta = a.starts_at ? new Date(a.starts_at).getTime() : Number.MAX_SAFE_INTEGER
    const tb = b.starts_at ? new Date(b.starts_at).getTime() : Number.MAX_SAFE_INTEGER
    return ta - tb || (a.sort_order ?? 0) - (b.sort_order ?? 0) || (a.game_no ?? 0) - (b.game_no ?? 0)
  })
}

function sortGamesForDisplay(items){
  return [...items].sort((a, b) => {
    const aFinished = !!a.actual_winner
    const bFinished = !!b.actual_winner

    if (aFinished !== bFinished) {
      return aFinished ? 1 : -1
    }

    const ta = a.starts_at ? new Date(a.starts_at).getTime() : Number.MAX_SAFE_INTEGER
    const tb = b.starts_at ? new Date(b.starts_at).getTime() : Number.MAX_SAFE_INTEGER

    if (!aFinished && !bFinished) {
      return ta - tb
    }

    return tb - ta
  })
}

export default function App(){
  const params = new URLSearchParams(window.location.search)
  const initialPool = params.get('pool') || localStorage.getItem('pp_pool') || 'demo'

  const [pool,setPool] = useState(initialPool)
  const [nickname,setNickname] = useState(localStorage.getItem('pp_nickname') || '')
  const [stage,setStage] = useState('Conference Finals')
  const [conference,setConference] = useState('East')
  const [msg,setMsg] = useState('')
  const [adminOpen,setAdminOpen] = useState(false)
  const [adminPass,setAdminPass] = useState('')
  const [adminReady,setAdminReady] = useState(false)

  const [matchups,setMatchups] = useState([])
  const [games,setGames] = useState([])
  const [seriesPicks,setSeriesPicks] = useState([])
  const [gamePicks,setGamePicks] = useState([])

  const [editingMatchupId,setEditingMatchupId] = useState(null)
  const [editingGameId,setEditingGameId] = useState(null)
  const [expandedSeriesGames,setExpandedSeriesGames] = useState({})
  const [expandedOthers,setExpandedOthers] = useState({})
  const [easterEgg,setEasterEgg] = useState('')
  const [seriesResultState,setSeriesResultState] = useState({})
  const [gameResultState,setGameResultState] = useState({})
  const [seriesDrafts,setSeriesDrafts] = useState({})

  const [adminForm,setAdminForm] = useState({
    stage:'Playoffs',
    conference:'East',
    round_label:'First Round',
    matchup_type:'series',
    team_a:'Celtics', // away / left
    team_b:'Knicks',  // home / right
    starts_at:'',
  })

  useEffect(()=>{
    localStorage.setItem('pp_pool', pool)
    const u = new URL(window.location.href)
    u.searchParams.set('pool', pool)
    window.history.replaceState({}, '', u.toString())
  },[pool])

  useEffect(()=>{ localStorage.setItem('pp_nickname', nickname) },[nickname])

  useEffect(()=>{ loadAll() },[pool])

  useEffect(() => {
    if (!easterEgg) return
    const t = setTimeout(() => setEasterEgg(''), 1400)
    return () => clearTimeout(t)
  }, [easterEgg])

  async function loadAll(){
    setMsg('')
    const [m,g,sp,gp] = await Promise.all([
      supabase.from('matchups').select('*').eq('pool', pool).order('sort_order'),
      supabase.from('games').select('*').eq('pool', pool).order('game_no'),
      supabase.from('series_picks').select('*').eq('pool', pool),
      supabase.from('game_picks').select('*').eq('pool', pool),
    ])
    const err = m.error || g.error || sp.error || gp.error
    if(err) return setMsg(err.message)
    setMatchups(m.data || [])
    setGames(g.data || [])
    setSeriesPicks(sp.data || [])
    setGamePicks(gp.data || [])
  }


  function triggerEgg(team, matchup){
    if (!isRocketsLakersSeries(matchup)) return
    if (team === 'Rockets') setEasterEgg('🚀 火箭升空')
    if (team === 'Lakers') setEasterEgg('👑 湖人加冕')
  }

  async function seedPlayIn(){
    const rows = PLAYIN_SEED.map(x=>({...x, pool}))
    const { error:e1 } = await supabase.from('matchups').upsert(rows,{onConflict:'pool,matchup_id'})
    if(e1) return setMsg(e1.message)
    const gameRows = rows.map(x=>({
      pool, matchup_id:x.matchup_id, game_no:1, label:x.round_label, team_a:x.team_a, team_b:x.team_b, starts_at:x.starts_at
    }))
    const { error:e2 } = await supabase.from('games').upsert(gameRows,{onConflict:'pool,matchup_id,game_no'})
    if(e2) return setMsg(e2.message)
    setMsg('附加赛已加入')
    loadAll()
  }

  async function seedPlayoffs(){
    const rows = PLAYOFF_SEED.map(x=>({...x, pool}))
    const { error } = await supabase.from('matchups').upsert(rows,{onConflict:'pool,matchup_id'})
    if(error) return setMsg(error.message)
    setMsg('季后赛占位已加入')
    loadAll()
  }

  async function addCustomMatchup(){
    if(!adminForm.team_a || !adminForm.team_b) return setMsg('队名没填全')
    if(adminForm.team_a === adminForm.team_b) return setMsg('主客队不能一样')
    const matchup_id = `${adminForm.stage}_${adminForm.conference}_${Date.now()}`
    const { error:e1 } = await supabase.from('matchups').insert({
      pool,
      matchup_id,
      stage:adminForm.stage,
      conference:adminForm.conference,
      round_label:adminForm.round_label,
      matchup_type:adminForm.matchup_type,
      team_a:adminForm.team_a, // away left
      team_b:adminForm.team_b, // home right
      starts_at:fromDatetimeLocalValue(adminForm.starts_at),
      sort_order:Date.now(),
    })
    if(e1) return setMsg(e1.message)
    if(adminForm.matchup_type === 'play_in'){
      const { error:e2 } = await supabase.from('games').insert({
        pool,
        matchup_id,
        game_no:1,
        label:adminForm.round_label,
        team_a:adminForm.team_a,
        team_b:adminForm.team_b,
        starts_at:fromDatetimeLocalValue(adminForm.starts_at),
      })
      if(e2) return setMsg(e2.message)
    }
    setMsg('已添加')
    loadAll()
  }

  async function addGameToSeries(matchup){
    const currentGames = games.filter(g=>g.matchup_id===matchup.matchup_id)
    const nextNo = currentGames.length ? Math.max(...currentGames.map(g=>g.game_no)) + 1 : 1
    const { error } = await supabase.from('games').insert({
      pool,
      matchup_id:matchup.matchup_id,
      game_no:nextNo,
      label:`G${nextNo}`,
      team_a:matchup.team_a, // away
      team_b:matchup.team_b, // home
      starts_at:null,
    })
    if(error) return setMsg(error.message)
    setMsg(`已新增 G${nextNo}`)
    loadAll()
  }

  async function deleteMatchup(matchup){
    if(!window.confirm(`删除 ${fullName(matchup.team_a)} vs ${fullName(matchup.team_b)}？`)) return
    const { error } = await supabase.from('matchups').delete().eq('pool',pool).eq('matchup_id',matchup.matchup_id)
    if(error) return setMsg(error.message)
    if (matchup) triggerEgg(winner, matchup)
    loadAll()
  }

  async function deleteGame(game){
    if(!window.confirm(`删除 ${game.label}？`)) return
    const { error } = await supabase.from('games').delete().eq('pool',pool).eq('id',game.id)
    if(error) return setMsg(error.message)
    loadAll()
  }

  async function deleteNickname(nick){
    if(!window.confirm(`删除 ${nick} 在当前 pool 的所有预测？`)) return
    const { error:e1 } = await supabase.from('series_picks').delete().eq('pool',pool).eq('nickname',nick)
    if(e1) return setMsg(e1.message)
    const { error:e2 } = await supabase.from('game_picks').delete().eq('pool',pool).eq('nickname',nick)
    if(e2) return setMsg(e2.message)
    setMsg(`已删除 ${nick} 的所有预测`)
    loadAll()
  }

  async function clearAllPredictions(){
    if(!window.confirm('清空当前 pool 的所有预测？赛程会保留。')) return
    const { error:e1 } = await supabase.from('series_picks').delete().eq('pool',pool)
    if(e1) return setMsg(e1.message)
    const { error:e2 } = await supabase.from('game_picks').delete().eq('pool',pool)
    if(e2) return setMsg(e2.message)
    setMsg('已清空当前 pool 的所有预测')
    loadAll()
  }

  async function saveMatchupEdit(matchup){
    const { error } = await supabase.from('matchups').update({
      team_a:matchup.team_a,
      team_b:matchup.team_b,
      round_label:matchup.round_label,
      starts_at:matchup.starts_at || null,
      stage:matchup.stage,
      conference:matchup.conference,
    }).eq('pool',pool).eq('matchup_id',matchup.matchup_id)
    if(error) return setMsg(error.message)
    const { error:gError } = await supabase.from('games').update({
      team_a:matchup.team_a,
      team_b:matchup.team_b,
    }).eq('pool',pool).eq('matchup_id',matchup.matchup_id)
    if(gError) return setMsg(gError.message)
    setEditingMatchupId(null)
    setMsg('对阵已更新')
    loadAll()
  }

  async function saveGameEdit(game){
    const { error } = await supabase.from('games').update({
      label:game.label,
      team_a:game.team_a,
      team_b:game.team_b,
      starts_at:game.starts_at || null,
    }).eq('pool',pool).eq('id',game.id)
    if(error) return setMsg(error.message)
    setEditingGameId(null)
    setMsg('小场已更新')
    loadAll()
  }

  async function saveGamePick(game, winner, matchup){
    if(!nickname.trim()) return setMsg('先填昵称')
    if (isPredictionClosed(game.starts_at, game.actual_winner)) return setMsg('该场比赛已截止预测')
    const { error } = await supabase.from('game_picks').upsert({
      pool, game_id:game.id, nickname:nickname.trim(), picked_winner:winner
    }, { onConflict:'pool,game_id,nickname' })
    if(error) return setMsg(error.message)
    loadAll()
  }

  function getSeriesDraft(matchup){
    const mine = seriesPicks.find(p => p.matchup_id===matchup.matchup_id && p.nickname===nickname)
    return seriesDrafts[matchup.matchup_id] || {
      winner: mine?.picked_winner || '',
      score: mine ? seriesScoreTextForDisplay(mine, matchup) : ''
    }
  }

  async function saveSeriesWinnerOnly(matchup, winner){
    if(!nickname.trim()) return setMsg('先填昵称')
    if (isSeriesPredictionClosed(matchup, gamesByMatchup)) return setMsg('G1 已开始，不能再修改大场预测')
    const draft = getSeriesDraft(matchup)
    setSeriesDrafts(prev=>({...prev,[matchup.matchup_id]:{winner,score:draft.winner===winner?draft.score:''}}))
    const { error } = await supabase.from('series_picks').upsert({
      pool, matchup_id:matchup.matchup_id, nickname:nickname.trim(),
      picked_winner:winner, picked_score_a:null, picked_score_b:null
    }, { onConflict:'pool,matchup_id,nickname' })
    if(error) return setMsg(error.message)
    triggerEgg(winner, matchup)
    loadAll()
  }

  async function saveSeriesExactScore(matchup, score){
    if(!nickname.trim()) return setMsg('先填昵称')
    if (isSeriesPredictionClosed(matchup, gamesByMatchup)) return setMsg('G1 已开始，不能再修改大场预测')
    const draft = getSeriesDraft(matchup)
    if(!draft.winner) return setMsg('先选谁晋级')
    const parsed = parseSeriesScoreForWinner(draft.winner, score, matchup.team_a, matchup.team_b)
    setSeriesDrafts(prev=>({...prev,[matchup.matchup_id]:{winner:draft.winner,score}}))
    const { error } = await supabase.from('series_picks').upsert({
      pool, matchup_id:matchup.matchup_id, nickname:nickname.trim(),
      picked_winner:draft.winner, picked_score_a:parsed.a, picked_score_b:parsed.b
    }, { onConflict:'pool,matchup_id,nickname' })
    if(error) return setMsg(error.message)
    triggerEgg(draft.winner, matchup)
    loadAll()
  }

  async function updateMatchupResult(matchup, winner, score){
    let scoreA=null, scoreB=null
    if(matchup.matchup_type==='series' && winner && score){
      const parsed = parseSeriesScoreForWinner(winner, score, matchup.team_a, matchup.team_b)
      scoreA=parsed.a
      scoreB=parsed.b
    }
    const { error } = await supabase.from('matchups').update({
      actual_winner:winner || null,
      actual_score_a:scoreA,
      actual_score_b:scoreB,
    }).eq('pool',pool).eq('matchup_id',matchup.matchup_id)
    if(error) return setMsg(error.message)
    loadAll()
  }

  async function updateGameResult(game, winner, scoreA, scoreB){
    const { error } = await supabase.from('games').update({
      actual_winner:winner || null,
      score_a: scoreA === '' || scoreA == null ? null : Number(scoreA),
      score_b: scoreB === '' || scoreB == null ? null : Number(scoreB),
    }).eq('pool',pool).eq('id',game.id)
    if(error) return setMsg(error.message)
    loadAll()
  }

  const gamesByMatchup = useMemo(()=>{
    const map={}
    games.forEach(g=>{
      if(!map[g.matchup_id]) map[g.matchup_id]=[]
      map[g.matchup_id].push(g)
    })
    Object.keys(map).forEach(k=>{ map[k]=sortByTime(map[k]) })
    return map
  },[games])

  function currentSeriesStanding(matchupId){
    const gs = gamesByMatchup[matchupId] || []
    let awayWins = 0
    let homeWins = 0
    gs.forEach(g=>{
      if(g.actual_winner === g.team_a) awayWins += 1
      if(g.actual_winner === g.team_b) homeWins += 1
    })
    return { awayWins, homeWins }
  }

  const visibleMatchups = useMemo(()=>{
    const source = matchups.filter(m => {
      if (stage === 'Play-In') {
        return m.stage === 'Play-In'
      }
      if (stage === 'Round 1') {
        return m.stage === 'Playoffs' && String(m.round_label || '').includes('First Round') && m.conference === conference
      }
      if (stage === 'Round 2') {
        return m.stage === 'Playoffs' && String(m.round_label || '').includes('Second Round') && m.conference === conference
      }
      if (stage === 'Conference Finals') {
        return m.stage === 'Playoffs' && (
          String(m.round_label || '').includes('Conference Finals') ||
          String(m.round_label || '').includes('Conf Finals') ||
          String(m.round_label || '').includes('Finals')
        )
      }
      return false
    })
    return sortByTime(source)
  },[matchups,stage,conference])

  const nicknamesInPool = useMemo(()=>{
    const s=new Set()
    seriesPicks.forEach(p=>s.add(p.nickname))
    gamePicks.forEach(p=>s.add(p.nickname))
    return Array.from(s).sort((a,b)=>a.localeCompare(b))
  },[seriesPicks,gamePicks])

  const leaderboard = useMemo(()=>{
    const score={}
    const add=(name,pts)=>{ score[name]=(score[name]||0)+pts }

    gamePicks.forEach(p=>{
      const g = games.find(x=>x.id===p.game_id)
      if(!g?.actual_winner) return
      const m = matchups.find(x=>x.matchup_id===g.matchup_id)
      if(p.picked_winner === g.actual_winner){
        add(p.nickname, m?.stage==='Play-In' ? 3 : 1)
      }
    })

    seriesPicks.forEach(p=>{
      const m = matchups.find(x=>x.matchup_id===p.matchup_id)
      if(!m || m.stage!=='Playoffs' || !m.actual_winner) return
      if(p.picked_winner === m.actual_winner){
        add(p.nickname,3)
        if(m.actual_score_a != null && m.actual_score_b != null){
          const display = seriesScoreTextForDisplay(p,m)
          const actual = m.actual_winner===m.team_a ? `${m.actual_score_a}:${m.actual_score_b}` : `${m.actual_score_b}:${m.actual_score_a}`
          if(display === actual) add(p.nickname,3)
        }
      }
    })

    const rows = Object.entries(score).map(([nickname,score])=>({nickname,score})).sort((a,b)=>b.score-a.score || a.nickname.localeCompare(b.nickname))
    return rows.map((row,i)=>{
      let rankNumber = 1
      for(let j=0;j<i;j++){ if(rows[j].score > row.score) rankNumber += 1 }
      let rankLabel = String(rankNumber)
      if(i===0) rankLabel='👑'
      if(i===rows.length-1) rankLabel='win a real predict'
      return {...row, rankLabel, isMine:row.nickname===nickname}
    })
  },[seriesPicks,gamePicks,games,matchups,nickname])

  return (
    <div className="page">
      {easterEgg && <div className="eggToast">{easterEgg}</div>}
      <div className="container">
        <header className="header">
          <div className="brand">
            <div className="kicker">NBA PREDICTOR</div>
            <h1>赛程与预测</h1>
          </div>

          <div className="headerCard">
            <label>Pool</label>
            <input value={pool} onChange={e=>setPool(e.target.value)} />
            <label>昵称</label>
            <input value={nickname} onChange={e=>setNickname(e.target.value)} placeholder="比如 Tianyu" />
            <div className="row">
              <button className="btn" onClick={()=>navigator.clipboard.writeText(window.location.href)}>复制链接</button>
              <button className="btn subtle" onClick={()=>setAdminOpen(v=>!v)}>管理员</button>
            </div>
            {adminOpen && (
              <div className="adminMini">
                <input type="password" value={adminPass} onChange={e=>setAdminPass(e.target.value)} placeholder="管理员密码" />
                <button className="btn" onClick={()=>{
                  if(adminPass===ADMIN_PASSWORD){ setAdminReady(true); setMsg('管理员模式已开启') }
                  else { setAdminReady(false); setMsg('密码不对') }
                }}>确认</button>
              </div>
            )}
          </div>
        </header>

        {msg && <div className="notice">{msg}</div>}

        <div className="stickyNav">
          <div className="chipRow">
            {STAGES.map(s=>(
              <button key={s} className={`chip ${stage===s?'active':''}`} onClick={()=>setStage(s)}>
                {s==='Conference Finals' ? '分区决赛' : s==='Round 2' ? '第二轮' : s==='Round 1' ? '第一轮' : '附加赛'}
              </button>
            ))}
          </div>
          {(stage==='Round 1' || stage==='Round 2') && (
            <div className="chipRow secondRow">
              {CONFS.map(c=>(
                <button key={c} className={`chip ${conference===c?'active':''}`} onClick={()=>setConference(c)}>
                  {c==='East' ? '东部' : '西部'}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="topPanels">
          <section className="panel">
            <div className="panelTitle">积分榜</div>
            {leaderboard.length===0 ? (
              <div className="muted">还没有结果可计分</div>
            ) : (
              leaderboard.map(row=>(
                <div className={`leader ${row.isMine?'mine':''}`} key={row.nickname}>
                  <div className="leaderRank">{row.rankLabel}</div>
                  <div className="leaderText">{row.nickname}{row.isMine?'（你）':''} · {row.score}</div>
                </div>
              ))
            )}
          </section>

          {adminReady && (
            <section className="panel">
              <div className="panelTitle">管理员</div>
              <div className="row wrap">
                <button className="btn" onClick={seedPlayIn}>加入附加赛</button>
                <button className="btn" onClick={seedPlayoffs}>加入季后赛占位</button>
                <button className="btn subtle" onClick={clearAllPredictions}>清空当前 pool 所有预测</button>
              </div>

              <div className="adminGrid" style={{marginTop:12}}>
                <select value={adminForm.stage} onChange={e=>setAdminForm({...adminForm, stage:e.target.value})}>
                  <option>Play-In</option>
                  <option>Playoffs</option>
                </select>
                <select value={adminForm.conference} onChange={e=>setAdminForm({...adminForm, conference:e.target.value})}>
                  <option>East</option>
                  <option>West</option>
                </select>
                <input value={adminForm.round_label} onChange={e=>setAdminForm({...adminForm, round_label:e.target.value})} placeholder="轮次" />
                <select value={adminForm.matchup_type} onChange={e=>setAdminForm({...adminForm, matchup_type:e.target.value})}>
                  <option value="play_in">单场</option>
                  <option value="series">系列赛</option>
                </select>
                <select value={adminForm.team_a} onChange={e=>setAdminForm({...adminForm, team_a:e.target.value})}>
                  {(adminForm.conference==='East' ? EAST_TEAMS : WEST_TEAMS).map(team=><option key={team} value={team}>客队（左）· {fullName(team)}</option>)}
                </select>
                <select value={adminForm.team_b} onChange={e=>setAdminForm({...adminForm, team_b:e.target.value})}>
                  {(adminForm.conference==='East' ? EAST_TEAMS : WEST_TEAMS).map(team=><option key={team} value={team}>主队（右）· {fullName(team)}</option>)}
                </select>
                <input type="datetime-local" value={adminForm.starts_at} onChange={e=>setAdminForm({...adminForm, starts_at:e.target.value})} />
                <button className="btn" onClick={addCustomMatchup}>添加对阵</button>
              </div>

              <div className="adminUserList" style={{marginTop:12}}>
                {nicknamesInPool.map(nick=>(
                  <div className="adminUserRow" key={nick}>
                    <span>{nick}{nick===nickname?'（你）':''}</span>
                    <button className="tiny danger" onClick={()=>deleteNickname(nick)}>删除这个用户</button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <section className="matchupList">
          {visibleMatchups.length===0 && <div className="empty">这里还没有对阵</div>}

          {visibleMatchups.map(m=>{
            const matchupGames = gamesByMatchup[m.matchup_id] || []
            const allSeriesPicks = seriesPicks.filter(x=>x.matchup_id===m.matchup_id).sort((a,b)=>(a.nickname===nickname?-1:b.nickname===nickname?1:a.nickname.localeCompare(b.nickname)))
            const draft = getSeriesDraft(m)
            const standing = currentSeriesStanding(m.matchup_id)
            const seriesResult = seriesResultState[m.matchup_id] || { winner:m.actual_winner || m.team_a, score:'4:2' }

            return (
              <article className="card" key={m.id}>
                <div className="cardHead">
                  <div className="fullWidth">
                    <div className="meta">
                      {m.stage==='Play-In'
                        ? `附加赛 · ${m.round_label}`
                        : stage==='Conference Finals'
                          ? `分区决赛 · ${m.round_label}`
                          : `季后赛 · ${m.conference} · ${m.round_label}`}
                    </div>

                    {m.matchup_type==='series' ? (
                      <>
                        <div className="seriesHeaderCenter">
                          <div className="seriesTeamCol">
                            <TeamBadge name={m.team_a} />
                            <div className="seriesStanding">{standing.awayWins}</div>
                          </div>
                          <div className="seriesVsBig">VS</div>
                          <div className="seriesTeamCol">
                            <TeamBadge name={m.team_b} />
                            <div className="seriesStanding">{standing.homeWins}</div>
                          </div>
                        </div>
                        <div className="time centeredTime">{fmt(m.starts_at)}</div>
                      </>
                    ) : (
                      <>
                        <div className="matchupTitle">
                          <TeamBadge name={m.team_a} />
                          <span className="vsText">vs</span>
                          <TeamBadge name={m.team_b} />
                        </div>
                        <div className="time">{fmt(m.starts_at)}</div>
                      </>
                    )}
                  </div>

                  {adminReady && (
                    <div className="adminActions topRightActions">
                      <button className="tiny subtle" onClick={()=>setEditingMatchupId(editingMatchupId===m.matchup_id?null:m.matchup_id)}>编辑对阵</button>
                      <button className="tiny danger" onClick={()=>deleteMatchup(m)}>删除对阵</button>
                    </div>
                  )}
                </div>

                {adminReady && editingMatchupId===m.matchup_id && (
                  <div className="adminResultBox stacked">
                    <div className="miniLabel">编辑对阵</div>
                    <div className="editHint">左侧是客队，右侧是主队。</div>
                    <select value={m.team_a} onChange={e=>setMatchups(prev=>prev.map(x=>x.matchup_id===m.matchup_id?{...x,team_a:e.target.value}:x))}>
                      {(m.conference==='East' ? EAST_TEAMS : WEST_TEAMS).map(team=><option key={team} value={team}>客队（左）· {fullName(team)}</option>)}
                    </select>
                    <select value={m.team_b} onChange={e=>setMatchups(prev=>prev.map(x=>x.matchup_id===m.matchup_id?{...x,team_b:e.target.value}:x))}>
                      {(m.conference==='East' ? EAST_TEAMS : WEST_TEAMS).map(team=><option key={team} value={team}>主队（右）· {fullName(team)}</option>)}
                    </select>
                    <input value={m.round_label || ''} onChange={e=>setMatchups(prev=>prev.map(x=>x.matchup_id===m.matchup_id?{...x,round_label:e.target.value}:x))} placeholder="轮次" />
                    <input type="datetime-local" value={toDatetimeLocalValue(m.starts_at)} onChange={e=>setMatchups(prev=>prev.map(x=>x.matchup_id===m.matchup_id?{...x,starts_at:fromDatetimeLocalValue(e.target.value)}:x))} />
                    <div className="row wrap">
                      <button className="tiny" onClick={()=>saveMatchupEdit(m)}>保存对阵修改</button>
                      <button className="tiny subtle" onClick={()=>setEditingMatchupId(null)}>取消</button>
                    </div>
                  </div>
                )}

                {m.matchup_type==='series' ? (
                  <section className="block">
                    <div className="seriesPickPanel">
                      <div className="seriesPickTitle">大场预测</div>
                      <div className="seriesPickHint">你觉得谁会赢下这个系列赛？</div>
                      <div className="pickButtons">
                        <button className={`btn choice ${draft.winner===m.team_a?'selected':''}`} disabled={isSeriesPredictionClosed(m, gamesByMatchup)} onClick={()=>saveSeriesWinnerOnly(m,m.team_a)}>
                          {shortName(m.team_a)}晋级
                        </button>
                        <button className={`btn choice ${draft.winner===m.team_b?'selected':''}`} disabled={isSeriesPredictionClosed(m, gamesByMatchup)} onClick={()=>saveSeriesWinnerOnly(m,m.team_b)}>
                          {shortName(m.team_b)}晋级
                        </button>
                      </div>

                      <div className="seriesPickHint">如果你还想猜具体大比分：</div>
                      <div className="pickButtons">
                        {SCORE_OPTIONS.map(score=>(
                          <button key={`${m.matchup_id}-${score}`} className={`btn choice ${draft.score===score?'selected':''}`} disabled={isSeriesPredictionClosed(m, gamesByMatchup)} onClick={()=>saveSeriesExactScore(m,score)}>
                            {score}
                          </button>
                        ))}
                      </div>
                    </div>

                    {m.actual_winner && (
                      <div className="actualLine top centeredActual">
                        真实晋级：<b>{shortName(m.actual_winner)}</b>
                        {m.actual_score_a != null && m.actual_score_b != null
                          ? `（${m.actual_winner===m.team_a ? `${m.actual_score_a}:${m.actual_score_b}` : `${m.actual_score_b}:${m.actual_score_a}`}）`
                          : ''}
                      </div>
                    )}

                    <div className="predictionBlock">
                      {allSeriesPicks.length===0 ? (
                        <div className="muted">还没人预测</div>
                      ) : (
                        allSeriesPicks.map(p=>{
                          const isMine = p.nickname===nickname
                          const isCorrect = m.actual_winner && p.picked_winner===m.actual_winner
                          const isWrong = m.actual_winner && p.picked_winner!==m.actual_winner
                          const scoreDisplay = seriesScoreTextForDisplay(p,m)
                          return (
                            <div key={`${m.matchup_id}-${p.nickname}`} className={lineClass(isMine,isCorrect,isWrong)}>
                              {p.nickname}{isMine?'（你）':''}：{shortName(p.picked_winner)}{scoreDisplay ? `，${scoreDisplay}` : ''}
                            </div>
                          )
                        })
                      )}

                    </div>

                    {adminReady && (
                      <div className="adminResultBox stacked">
                        <div className="miniLabel">管理员：系列赛结果</div>
                        <select value={seriesResult.winner} onChange={e=>setSeriesResultState(prev=>({...prev,[m.matchup_id]:{...seriesResult,winner:e.target.value}}))}>
                          <option value={m.team_a}>{shortName(m.team_a)}</option>
                          <option value={m.team_b}>{shortName(m.team_b)}</option>
                        </select>
                        <select value={seriesResult.score} onChange={e=>setSeriesResultState(prev=>({...prev,[m.matchup_id]:{...seriesResult,score:e.target.value}}))}>
                          {SCORE_OPTIONS.map(s=><option key={s}>{s}</option>)}
                        </select>
                        <div className="row wrap">
                          <button className="tiny" onClick={()=>updateMatchupResult(m,seriesResult.winner,seriesResult.score)}>保存系列赛结果</button>
                          <button className="tiny subtle" onClick={()=>updateMatchupResult(m,null,null)}>清空</button>
                          <button className="tiny" onClick={()=>addGameToSeries(m)}>新增小场</button>
                        </div>
                      </div>
                    )}
                  </section>
                ) : (
                  <section className="block">
                    {matchupGames.map(g=>(
                      <GameCard
                        key={g.id}
                        g={g}
                        matchup={m}
                        nickname={nickname}
                        allGamePicks={gamePicks.filter(x=>x.game_id===g.id).sort((a,b)=>(a.nickname===nickname?-1:b.nickname===nickname?1:a.nickname.localeCompare(b.nickname)))}
                        adminReady={adminReady}
                        editingGameId={editingGameId}
                        setEditingGameId={setEditingGameId}
                        setGames={setGames}
                        saveGameEdit={saveGameEdit}
                        deleteGame={deleteGame}
                        saveGamePick={saveGamePick}
                        gameResultState={gameResultState}
                        setGameResultState={setGameResultState}
                        updateGameResult={updateGameResult}
                        expandedOthers={expandedOthers}
                        setExpandedOthers={setExpandedOthers}
                      />
                    ))}
                  </section>
                )}
                {m.matchup_type==='series' && (
                  <section className="block">
                    <div className="games">
                      {matchupGames.length===0 ? <div className="muted">还没有小场</div> : matchupGames.map(g=>(
                        <GameCard
                          key={g.id}
                          g={g}
                          matchup={m}
                          nickname={nickname}
                          allGamePicks={gamePicks.filter(x=>x.game_id===g.id).sort((a,b)=>(a.nickname===nickname?-1:b.nickname===nickname?1:a.nickname.localeCompare(b.nickname)))}
                          adminReady={adminReady}
                          editingGameId={editingGameId}
                          setEditingGameId={setEditingGameId}
                          setGames={setGames}
                          saveGameEdit={saveGameEdit}
                          deleteGame={deleteGame}
                          saveGamePick={saveGamePick}
                          gameResultState={gameResultState}
                          setGameResultState={setGameResultState}
                          updateGameResult={updateGameResult}
                          expandedOthers={expandedOthers}
                          setExpandedOthers={setExpandedOthers}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </article>
            )
          })}
        </section>
      </div>
    </div>
  )
}


function GameCard({
  g, matchup, nickname, allGamePicks, adminReady, editingGameId, setEditingGameId, setGames, saveGameEdit,
  deleteGame, saveGamePick, gameResultState, setGameResultState, updateGameResult, expandedOthers, setExpandedOthers
}){
  const gameResult = gameResultState[g.id] || { winner:g.actual_winner || g.team_b, score_a:g.score_a ?? '', score_b:g.score_b ?? '' }
  const myPick = allGamePicks.find(p => p.nickname === nickname)
  const others = allGamePicks.filter(p => p.nickname !== nickname)
  const opened = !!expandedOthers[g.id]
  const predictionClosed = isPredictionClosed(g.starts_at, g.actual_winner)

  return (
    <div className="gameCard compactGame">
      <div className="compactTop">
        <div className="gameLabel">{g.label}</div>
        <div className="compactStatus">{g.actual_winner ? '已结束' : fmt(g.starts_at)}</div>
      </div>

      <div className="compactTeams">
        <div className="compactTeam">{shortName(g.team_a)} {g.score_a != null ? g.score_a : '-'}</div>
        <div className="gameVs">vs</div>
        <div className="compactTeam right">{g.score_b != null ? g.score_b : '-'} {shortName(g.team_b)}</div>
      </div>

      <div className="compactMine">你：{myPick ? shortName(myPick.picked_winner) : '还没预测'}</div>

      {!g.actual_winner && (
        <div className="pickButtons compactButtons">
          <button className="btn choice" disabled={predictionClosed} onClick={()=>saveGamePick(g,g.team_a,matchup)}>客 {shortName(g.team_a)}</button>
          <button className="btn choice" disabled={predictionClosed} onClick={()=>saveGamePick(g,g.team_b,matchup)}>主 {shortName(g.team_b)}</button>
        </div>
      )}
      {predictionClosed && !g.actual_winner && <div className="compactMuted">该场比赛已截止预测</div>}

      {others.length > 0 ? (
        <>
          <button className="othersToggle" onClick={()=>setExpandedOthers(prev=>({...prev,[g.id]:!prev[g.id]}))}>
            {opened ? '▾ 收起其他人预测' : '▸ 查看其他人预测'}
          </button>
          {opened && (
            <div className="othersWrap">
              {others.map(p=>{
                const isCorrect = g.actual_winner && p.picked_winner===g.actual_winner
                const isWrong = g.actual_winner && p.picked_winner!==g.actual_winner
                return <div key={`${g.id}-${p.nickname}`} className={lineClass(false,isCorrect,isWrong)}>{p.nickname}：{shortName(p.picked_winner)}</div>
              })}
            </div>
          )}
        </>
      ) : (
        <div className="muted compactMuted">还没有其他人预测</div>
      )}

      {adminReady && (
        <div className="adminResultBox stacked">
          <div className="row wrap" style={{marginBottom:8}}>
            <button className="tiny subtle" onClick={()=>setEditingGameId(editingGameId===g.id?null:g.id)}>编辑本场</button>
            <button className="tiny danger" onClick={()=>deleteGame(g)}>删除本场</button>
          </div>

          {editingGameId===g.id && (
            <>
              <div className="miniLabel">编辑本场</div>
              <div className="editHint">左侧是客队，右侧是主队。</div>
              <input value={g.label || ''} onChange={e=>setGames(prev=>prev.map(x=>x.id===g.id?{...x,label:e.target.value}:x))} placeholder="标签，比如 G1" />
              <select value={g.team_a} onChange={e=>setGames(prev=>prev.map(x=>x.id===g.id?{...x,team_a:e.target.value}:x))}>
                {Object.keys(TEAM_META).map(team=><option key={team} value={team}>客队（左）· {fullName(team)}</option>)}
              </select>
              <select value={g.team_b} onChange={e=>setGames(prev=>prev.map(x=>x.id===g.id?{...x,team_b:e.target.value}:x))}>
                {Object.keys(TEAM_META).map(team=><option key={team} value={team}>主队（右）· {fullName(team)}</option>)}
              </select>
              <input type="datetime-local" value={toDatetimeLocalValue(g.starts_at)} onChange={e=>setGames(prev=>prev.map(x=>x.id===g.id?{...x,starts_at:fromDatetimeLocalValue(e.target.value)}:x))} />
              <div className="row wrap">
                <button className="tiny" onClick={()=>saveGameEdit(g)}>保存本场修改</button>
                <button className="tiny subtle" onClick={()=>setEditingGameId(null)}>取消</button>
              </div>
            </>
          )}

          <div className="miniLabel" style={{marginTop:8}}>管理员：本场结果</div>
          <select value={gameResult.winner} onChange={e=>setGameResultState(prev=>({...prev,[g.id]:{...gameResult,winner:e.target.value}}))}>
            <option value={g.team_a}>{shortName(g.team_a)}</option>
            <option value={g.team_b}>{shortName(g.team_b)}</option>
          </select>
          <div className="row">
            <input className="smallInput" placeholder={shortName(g.team_a)} value={gameResult.score_a} onChange={e=>setGameResultState(prev=>({...prev,[g.id]:{...gameResult,score_a:e.target.value}}))} />
            <input className="smallInput" placeholder={shortName(g.team_b)} value={gameResult.score_b} onChange={e=>setGameResultState(prev=>({...prev,[g.id]:{...gameResult,score_b:e.target.value}}))} />
          </div>
          <div className="row wrap">
            <button className="tiny" onClick={()=>updateGameResult(g,gameResult.winner,gameResult.score_a,gameResult.score_b)}>保存本场结果</button>
            <button className="tiny subtle" onClick={()=>updateGameResult(g,null,'','')}>清空</button>
          </div>
        </div>
      )}
    </div>
  )
}
