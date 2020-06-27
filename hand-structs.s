	.section	__TEXT,__text,regular,pure_instructions
	.macosx_version_min 10, 13
	.section	__TEXT,__literal8,8byte_literals
	.p2align	3               ## -- Begin function main
LCPI0_0:
	.quad	4617878467915022336     ## double 5.5
	.section	__TEXT,__text,regular,pure_instructions
	.globl	_main
	.p2align	4, 0x90
_main:                                  ## @main
	.cfi_startproc
## %bb.0:
	subq	$40, %rsp
	.cfi_def_cfa_offset 48
	movsd	LCPI0_0(%rip), %xmm0    ## xmm0 = mem[0],zero
	leaq	24(%rsp), %rax
	movq	%rax, 16(%rsp)
	movq	16(%rsp), %rax
	movl	$65, (%rax)
	movsd	%xmm0, 8(%rax)
	movl	(%rax), %edi
	callq	_putchar
	xorl	%ecx, %ecx
	movl	%eax, 12(%rsp)          ## 4-byte Spill
	movl	%ecx, %eax
	addq	$40, %rsp
	retq
	.cfi_endproc
                                        ## -- End function
.subsections_via_symbols
