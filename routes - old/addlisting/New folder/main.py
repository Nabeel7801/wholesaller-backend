from py2neo import Graph,Node,Relationship
graph=Graph(password="saeed")
f = open("output.txt", "w+")

result = graph.run("""
    match (a:Person)-[:ACTED_IN]->(m:Movie) 
    with count(m) as num,a as a return a.name,num 
    order by num desc 
    limit 20""")

f.write("### AI-LAB Q1 ###\n")
for x in result:
    f.write(x['a.name']+", "+str(x['num'])+'\n')


f.write("\n### AI-LAB Q2 ###\n")
result = graph.run("""
    match (p:Person)-[r:RATED]->(m:Movie) 
    where r.stars<4 
    return m.title""")

for x in result:
    f.write(x['m.title']+'\n')

result = graph.run("""
    match (p:Person)-[r:RATED]->(m:Movie)<-[:ACTED_IN]-(a:Person)
    with m as m, count(distinct a) as cast return m.title, cast
    order by cast desc limit 1
""")

f.write("\n### AI-LAB Q3 ###\n")
for x in result:
    f.write(x['m.title']+": "+str(x['cast'])+'\n')

result = graph.run("""
    match (a:Person)-[:ACTED_IN]->(m:Movie)<-[:DIRECTED]-(d:Person) 
    with size(collect(distinct d.name)) as num,a as a 
    where num>=3 
    return a.name,num""")

f.write("\n### AI-LAB  Q4 ###\n")
for x in result:
    f.write(x['a.name']+", "+str(x['num'])+'\n')



result=graph.run("""
    match (bacon:Person {name:"Kevin Bacon"})-[:ACTED_IN]->(m:Movie)<-[:ACTED_IN]-(a:Person)
    -[:ACTED_IN]->(m2:Movie)<-[:ACTED_IN]-(a2:Person) 
    return a2.name
""")

f.write("\n### Q5 ###\n")

for x in result:
    f.write(str(x['a2.name'])+'\n')

result=graph.run("""
    match (p:Person {name:'Tom Hanks'})-[:ACTED_IN]->(m:Movie) 
    with collect(distinct m.genre) as res
    return res
""")

f.write("\n### ###\n")

for x in result:
    f.write(str(x['res'])+'\n')


result=graph.run("""
    match (d:Person)-[:DIRECTED]->(m:Movie) 
    with count(distinct m.genre) as num_g,d as d 
    where num_g>1 
    return d.name,num_g order by num_g 
""")

f.write("\n### ###\n")

for x in result:
    f.write(str(x['d.name'])+", "+str(x['num_g'])+'\n')

result=graph.run("""
    match (d:Person)-[:DIRECTED]->(m:Movie)<-[:ACTED_IN]-(a:Person)  
    with a as a1,d as d1 match (d1)-[:DIRECTED]->(m1:Movie)<-[:ACTED_IN]-(a1)  
    return d1.name,a1.name,count(distinct m1) 
    order by count(distinct m1) desc limit 5
""")


f.write("\n### AI-LAB Q8 ###\n")
for x in result:
    f.write(str(x['d1.name'])+", "+str(x['a1.name'])+", "+str(x['count(distinct m1)'])+'\n')
