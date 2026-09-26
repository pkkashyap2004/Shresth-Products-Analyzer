from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
app=FastAPI(title='Shresth Products Analyzer AI Service',version='1.0.0')
class MetricPoint(BaseModel):
    name:str
    value:float
    previous:float|None=None
class InsightRequest(BaseModel):
    metrics:List[MetricPoint]
@app.get('/health')
def health(): return {'ok':True,'service':'python-ai'}
@app.post('/insights')
def insights(req:InsightRequest):
    out=[]
    for m in req.metrics:
        if m.previous is None: continue
        change=((m.value-m.previous)/m.previous*100) if m.previous else 0
        if abs(change)>=5:
            direction='increased' if change>0 else 'decreased'
            out.append({'metric':m.name,'fact':f'{m.name} {direction} by {abs(change):.1f}%.','hypothesis':'This is a signal requiring validation; correlation does not establish causality.','recommendation':'Segment the metric by platform, cohort and funnel step before choosing an experiment.','change_pct':round(change,2)})
    return {'insights':out,'count':len(out)}
