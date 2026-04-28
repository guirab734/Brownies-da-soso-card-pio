# Bug Hunt — Aula 06
## Grupo 1

**Banco de dados:** Chinook · PostgreSQL  
**Tabelas:** `invoice` · `employee`

---

## Regras da dinâmica

Cada query abaixo está **quebrada**. Pode faltar parte da lógica, pode ter algo errado no que está escrito, pode ter os dois ao mesmo tempo. O enunciado descreve exatamente o que o cliente precisa — a query não entrega isso.

### O que a equipe precisa entregar

Para cada query, a equipe deve registrar:

1. **A query incorreta** — exatamente como está aqui
2. **O que foi encontrado** — descrever os problemas em português, explicando por que a query não resolve o enunciado
3. **Como chegaram na solução** — o raciocínio que levou à correção
4. **A query correta** — a versão funcionando no banco que entrega o que o enunciado pede

A entrega é feita por escrito. Cada query vale **1 ponto**. A equipe que entregar mais respostas corretas e bem explicadas vence.

---

## Queries

---

### Query 1

> O time comercial quer um relatório de faturamento por país. Mostre o país, o total faturado e o número de faturas, mas apenas para países com **pelo menos 15 faturas**. Ordene do país que mais faturou para o que menos faturou.

```sql
select
  billing_country as pais,
  count(invoice_id) as total_faturas
from
  invoice
group by
  pais,
  billing_city
having
  count(invoice_id) < 15
order by
  total_faturas desc;
```

---

### Query 2

> O time de análise quer saber o ticket médio por país — o valor médio gasto por fatura. Mostre o país e o ticket médio arredondado para 2 casas decimais, apenas para países com ticket médio **acima de 5.00**. Ordene do maior ticket médio para o menor.

```sql
select
  round(avg(total), 2) as ticket_medio
from
  invoice
where
  billing_country not like '%a'
group by
  pais
having
  round(avg(total), 2) > 5.00
order by
  ticket_medio desc;
```

---

### Query 3

> O time regional quer saber o faturamento total por estado no Brasil. Mostre o estado e o total faturado, apenas para estados onde o faturamento **passou de 30**. Ordene do estado que mais faturou para o que menos faturou.

```sql
select
  billing_state as estado,
  sum(total) as faturamento_total
from
  invoice
group by
  estado
having
  sum(total) > 30
order by
  estado asc;
```

---

### Query 4

> O time de planejamento quer saber quantas faturas foram emitidas por mês em 2009. Mostre o mês e a contagem de faturas. Ordene do mês com mais faturas para o com menos.

```sql
select
  extract(month from invoice_date) as mes
from
  invoice
group by
  mes
having
  count(*) > 0
order by
  mes asc;
```

---

### Query 5

> O time de expansão quer saber o faturamento total e o número de faturas por cidade americana. Mostre apenas cidades com **mais de 3 faturas**. Ordene da cidade que mais faturou para a que menos faturou.

```sql
select
  billing_city as cidade,
  sum(total) as faturamento_total
from
  invoice
group by
  cidade
having
  sum(total) > 3
order by
  faturamento_total desc;
```

---

### Query 6

> O time financeiro quer saber o faturamento total por ano. Mostre o ano e o total faturado. Ordene do ano com maior faturamento para o menor.

```sql
select
  sum(total) as faturamento_total
from
  invoice
group by
  extract(year from invoice_date)
order by
  extract(year from invoice_date) asc;
```

---

### Query 7

> O time de cobrança quer identificar as faturas de maior valor. Mostre o `invoice_id` e o total, apenas para faturas com valor **acima de 15**. Ordene da fatura de maior valor para a de menor.

```sql
select
  total as valor_fatura
from
  invoice
where
  total > 15
order by
  total desc;
```

---

### Query 8

> O time regional quer saber quantas faturas distintas existem por cidade no Canadá. Mostre a cidade e o total de faturas, apenas para cidades com **mais de 2 faturas**. Ordene da cidade com mais faturas para a com menos.

```sql
select
  billing_city as cidade,
  count(invoice_id) as total_faturas
from
  invoice
group by
  cidade
having
  count(invoice_id) >= 2
order by
  total_faturas desc;
```

---

### Query 9

> O time de RH quer saber quantos funcionários existem em cada cidade. Mostre a cidade e o total de funcionários. Ordene da cidade com mais funcionários para a com menos.

```sql
select
  city as cidade
from
  employee
order by
  cidade asc;
```

---

### Query 10

> O time de gestão quer saber a média salarial por título de cargo dos funcionários. Mostre o título e o total de funcionários em cada cargo. Ordene do cargo com mais funcionários para o com menos.

```sql
select
  count(employee_id) as total_funcionarios
from
  employee
group by
  title
having
  count(employee_id) > 1
order by
  total_funcionarios desc;
```
